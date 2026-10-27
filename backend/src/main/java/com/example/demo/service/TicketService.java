package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.StatusUpdateRequestDto;
import com.example.demo.dto.TicketRequestDto;
import com.example.demo.dto.TicketResponseDto;
import com.example.demo.entity.AgentProfile;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.SupportTicket;
import com.example.demo.entity.Status;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AgentProfileRepository;
import com.example.demo.repository.EscalationRecordRepository;
import com.example.demo.repository.SupportTicketRepository;
import com.example.demo.repository.TicketAssignmentRepository;

@Service
public class TicketService {
    
    private final SupportTicketRepository supportTicketRepository;
    private final AgentProfileRepository agentProfileRepository;
    private final TicketAssignmentRepository ticketAssignmentRepository;
    private final EscalationRecordRepository escalationRepository; 
    @Autowired
    public TicketService(SupportTicketRepository supportTicketRepository,
                         AgentProfileRepository agentProfileRepository,
                         TicketAssignmentRepository ticketAssignmentRepository,
                         EscalationRecordRepository escalationRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.agentProfileRepository = agentProfileRepository;
        this.ticketAssignmentRepository = ticketAssignmentRepository;
        this.escalationRepository = escalationRepository;
    }
    
    private static final Map<Status, List<Status>> VALID_TRANSITIONS = Map.of(
        Status.OPEN, List.of(Status.IN_PROGRESS, Status.CLOSED, Status.ESCALATED),
        Status.IN_PROGRESS, List.of(Status.RESOLVED, Status.ESCALATED, Status.OPEN),
        Status.ESCALATED, List.of(Status.IN_PROGRESS, Status.CLOSED),
        Status.RESOLVED, List.of(Status.CLOSED, Status.OPEN),
        Status.CLOSED, List.of()
    );

    @Transactional
    public TicketResponseDto createTicket(TicketRequestDto dto, AppUser creator) {
        SupportTicket ticket = new SupportTicket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setCategory(dto.getCategory());
        ticket.setPriority(dto.getPriority());
        ticket.setStatus(Status.OPEN); 
        ticket.setCreator(creator);
        
        LocalDateTime now = LocalDateTime.now();
        if (dto.getPriority() != null) {
            switch (dto.getPriority()) {
                case CRITICAL -> ticket.setSlaDeadline(now.plusHours(4));
                case HIGH -> ticket.setSlaDeadline(now.plusHours(12));
                case MEDIUM -> ticket.setSlaDeadline(now.plusHours(24));
                case LOW -> ticket.setSlaDeadline(now.plusHours(72));
            }
        }

        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        return mapToResponseDto(savedTicket);
    }

    @Transactional
    public TicketResponseDto updateStatus(Long ticketId, StatusUpdateRequestDto dto) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        Status currentStatus = ticket.getStatus();
        Status newStatus = dto.getStatus();
        
        List<Status> allowedNextStates = VALID_TRANSITIONS.getOrDefault(currentStatus, List.of());
        if (!allowedNextStates.contains(newStatus)) {
            throw new BusinessValidationException(
                "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }
        
        ticket.setStatus(newStatus);
        
        if (newStatus == Status.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
            
            ticketAssignmentRepository.findByTicketIdAndIsActiveTrue(ticket.getId())
                .ifPresent(assignment -> {
                    AgentProfile agent = assignment.getAgent();
                    if (agent.getCurrentLoad() > 0) {
                        agent.setCurrentLoad(agent.getCurrentLoad() - 1);
                        agentProfileRepository.save(agent);
                    }
                });

        } else if (currentStatus == Status.RESOLVED && newStatus == Status.OPEN) {
            ticket.setResolvedAt(null);
            ticketAssignmentRepository.findByTicketIdAndIsActiveTrue(ticket.getId())
                .ifPresent(assignment -> {
                    AgentProfile agent = assignment.getAgent();
                    agent.setCurrentLoad(agent.getCurrentLoad() + 1);
                    agentProfileRepository.save(agent);
                });
        }

        SupportTicket updatedTicket = supportTicketRepository.save(ticket);
        updatedTicket.setUpdatedAt(LocalDateTime.now());
        return mapToResponseDto(updatedTicket);
    }

    public TicketResponseDto getTicketById(Long id) {
        return supportTicketRepository.findById(id)
            .map(this::mapToResponseDto)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public List<TicketResponseDto> getAllTickets() {
        List<SupportTicket> alltickets = supportTicketRepository.findAll();
        List<TicketResponseDto> converted = new ArrayList<>();
        for (SupportTicket i : alltickets) {
            TicketResponseDto inst = mapToResponseDto(i);
            converted.add(inst);
        }
        return converted;
    }

    public List<TicketResponseDto> getTicketsByAgent(Long userId) {
        AgentProfile agent = agentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found for user id: " + userId));

        return ticketAssignmentRepository.findByAgentIdAndIsActiveTrue(agent.getId()).stream()
            .map(assignment -> assignment.getTicket())
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }

    public List<TicketResponseDto> getTicketsByCreator(Long creatorId) {
        return supportTicketRepository.findByCreatorId(creatorId).stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }

    public List<TicketResponseDto> getTicketsByStatus(Status status) {
        return supportTicketRepository.findByStatus(status).stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }

    public List<TicketResponseDto> getTicketsAtSlaRisk() {
        LocalDateTime deadlineThreshold = LocalDateTime.now().plusHours(24);
        return supportTicketRepository.findTicketsAtSlaRisk(deadlineThreshold).stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }

    public Map<String, Long> getTicketStats() {
        Map<String, Long> stats = new HashMap<>();
        for (Status status : Status.values()) {
            stats.put(status.name(), supportTicketRepository.countByStatus(status));
        }
        return stats;
    }
   private TicketResponseDto mapToResponseDto(SupportTicket ticket) {
    TicketResponseDto response = new TicketResponseDto();
    response.setId(ticket.getId());
    response.setTitle(ticket.getTitle());
    response.setDescription(ticket.getDescription()); 
    response.setCategory(ticket.getCategory());       
    response.setStatus(ticket.getStatus());
    response.setPriority(ticket.getPriority()); 
    response.setSlaDeadline(ticket.getSlaDeadline());
    response.setCreatedAt(ticket.getCreatedAt()); 
    response.setUpdatedAt(ticket.getUpdatedAt()); 
    response.setResolvedAt(ticket.getResolvedAt()); 
    
    if (ticket.getCreator() != null) {
        response.setCreatorId(ticket.getCreator().getId());
        response.setCreatorName(ticket.getCreator().getFullName());
    }

    // --- NEW LOGIC: Fetch the active agent name ---
    ticketAssignmentRepository.findByTicketIdAndIsActiveTrue(ticket.getId())
        .ifPresent(assignment -> {
            // Adjust the exact getter chain based on your entity setup (e.g., getAppUser() vs getUser())
            response.setAssignedAgentName(assignment.getAgent().getUser().getFullName());
        });
    // ----------------------------------------------

    response.setCommentCount(ticket.getComments() != null ? ticket.getComments().size() : 0);
    int escalationCount = (int) escalationRepository.countByTicketId(ticket.getId());
    response.setEscalationCount(escalationCount);
    
    return response;
}
}