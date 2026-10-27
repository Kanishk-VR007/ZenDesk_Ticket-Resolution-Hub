package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.EscalationRequestDto;
import com.example.demo.dto.EscalationResponseDto;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.SupportTicket;
import com.example.demo.entity.Priority;
import com.example.demo.entity.Status;
import com.example.demo.entity.EscalationRecord;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SupportTicketRepository;
import com.example.demo.repository.EscalationRecordRepository;

@Service
public class EscalationService {

    private final SupportTicketRepository ticketRepository;
    private final EscalationRecordRepository escalationRepository;

    @Autowired
    public EscalationService(SupportTicketRepository ticketRepository, 
                             EscalationRecordRepository escalationRepository) {
        this.ticketRepository = ticketRepository;
        this.escalationRepository = escalationRepository;
    }

    @Transactional
    public EscalationResponseDto createEscalation(EscalationRequestDto dto, AppUser requestor) {
        SupportTicket ticket = ticketRepository.findById(dto.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + dto.getTicketId()));

        if (ticket.getStatus() == Status.CLOSED) {
            throw new BusinessValidationException("Cannot escalate a CLOSED ticket.");
        }
        int nextLevel = (int) escalationRepository.countByTicketId(ticket.getId()) + 1;

        if (nextLevel > 3) {
            throw new BusinessValidationException("Maximum escalation level (3) has already been reached.");
        }
        ticket.setStatus(Status.ESCALATED);
        if (nextLevel >= 2 && ticket.getPriority() != Priority.CRITICAL) {
            switch (ticket.getPriority()) {
                case LOW -> ticket.setPriority(Priority.MEDIUM);
                case MEDIUM -> ticket.setPriority(Priority.HIGH);
                case HIGH -> ticket.setPriority(Priority.CRITICAL);
                default -> { } 
            }
        }
        
        ticketRepository.save(ticket);
        EscalationRecord escalation = new EscalationRecord();
        escalation.setTicket(ticket);
        escalation.setEscalatedLevel(nextLevel);
        escalation.setReason(dto.getReason());
        escalation.setEscalatedBy(requestor);
        EscalationRecord savedEscalation = escalationRepository.save(escalation);

        return mapToDto(savedEscalation);
    }

    @Transactional
    public EscalationResponseDto resolveEscalation(Long escalationId) {
        EscalationRecord escalation = escalationRepository.findById(escalationId)
                .orElseThrow(() -> new ResourceNotFoundException("Escalation record not found with id: " + escalationId));

        if (escalation.getResolvedAt() != null) {
            throw new BusinessValidationException("This escalation has already been resolved.");
        }
        escalation.setResolvedAt(LocalDateTime.now());
        escalation.setResolved(true);
        EscalationRecord savedEscalation = escalationRepository.save(escalation);
        SupportTicket ticket = escalation.getTicket();
        ticket.setStatus(Status.IN_PROGRESS);
        ticketRepository.save(ticket);

        return mapToDto(savedEscalation);
    }


    public List<EscalationResponseDto> getEscalationsByTicket(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new ResourceNotFoundException("Ticket not found with id: " + ticketId);
        }
        
        return escalationRepository.findByTicketId(ticketId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<EscalationResponseDto> getAllEscalations() {
        return escalationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<EscalationResponseDto> getUnresolvedEscalations() {
        return escalationRepository.findByIsResolvedFalse().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private EscalationResponseDto mapToDto(EscalationRecord escalation) {
        EscalationResponseDto dto = new EscalationResponseDto();
        
        dto.setId(escalation.getId());
        dto.setTicketId(escalation.getTicket().getId());
        dto.setTicketTitle(escalation.getTicket().getTitle()); // Fixes the missing title
        dto.setEscalationLevel(escalation.getEscalatedLevel());
        dto.setReason(escalation.getReason());
        
        // Fixes the blank "Escalated By" column
        if (escalation.getEscalatedBy() != null) {
            dto.setEscalatedByName(escalation.getEscalatedBy().getFullName());
        } else {
            dto.setEscalatedByName("System");
        }
        
        // Fixes the "Invalid Date" issue
        dto.setEscalatedAt(escalation.getEscalatedAt()); 
        dto.setResolvedAt(escalation.getResolvedAt());
        
        return dto;
    }
}