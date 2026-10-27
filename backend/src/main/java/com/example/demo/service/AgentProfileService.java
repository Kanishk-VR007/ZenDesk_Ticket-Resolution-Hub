package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AgentProfileResponseDto;
import com.example.demo.entity.AgentProfile;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AgentProfileRepository;
import com.example.demo.repository.TicketAssignmentRepository;

@Service
public class AgentProfileService {

    private final AgentProfileRepository agentProfileRepository;
    private final TicketAssignmentRepository ticketAssignmentRepository;

    @Autowired
    public AgentProfileService(AgentProfileRepository agentProfileRepository, 
                               TicketAssignmentRepository ticketAssignmentRepository){
        this.agentProfileRepository = agentProfileRepository;
        this.ticketAssignmentRepository = ticketAssignmentRepository;
    }
    public List<AgentProfileResponseDto> getAllAgents() {
        return agentProfileRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    public AgentProfileResponseDto getAgentById(Long id) {
        AgentProfile profile = agentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found with ID: " + id));
        
        return mapToResponseDto(profile);
    }
    public List<AgentProfileResponseDto> getAgentsByWorkload() {
        return agentProfileRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .sorted((a1, a2) -> Double.compare(a2.getLoadPercentage(), a1.getLoadPercentage()))
                .collect(Collectors.toList());
    }
    @Transactional
    public AgentProfileResponseDto toggleAvailability(Long id) {
        AgentProfile profile = agentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found with ID: " + id));
        
        profile.setAvailable(!profile.isAvailable());
        
        AgentProfile savedProfile = agentProfileRepository.save(profile);
        return mapToResponseDto(savedProfile);
    }
    @Transactional
    public AgentProfileResponseDto recalculateCurrentLoad(Long id) {
        AgentProfile profile = agentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found with ID: " + id)); 
        
        int activeAssignmentsCount = (int) ticketAssignmentRepository.countByAgentIdAndIsActiveTrue(id);
        
        profile.setCurrentLoad(activeAssignmentsCount);
        
        AgentProfile savedProfile = agentProfileRepository.save(profile);
        return mapToResponseDto(savedProfile);
    }
    
    private AgentProfileResponseDto mapToResponseDto(AgentProfile profile) {
        AgentProfileResponseDto dto = new AgentProfileResponseDto();
        
        dto.setId(profile.getId());
        
        if (profile.getUser() != null) {
            dto.setUserId(profile.getUser().getId());
            dto.setFullName(profile.getUser().getFullName());
            dto.setEmail(profile.getUser().getEmail());
        }
        
        dto.setDepartment(profile.getDepartment());
        dto.setSpecialization(profile.getSpecialization());
        dto.setCurrentLoad(profile.getCurrentLoad());
        dto.setMaxCapacity(profile.getMaxCapacity());
        dto.setAvailable(profile.isAvailable());
        
        if (profile.getMaxCapacity() > 0) {
            double percentage = ((double) profile.getCurrentLoad() / profile.getMaxCapacity()) * 100.0;
            dto.setLoadPercentage(percentage);
        } else {
            dto.setLoadPercentage(0.0);
        }
        
        return dto;
    }
}