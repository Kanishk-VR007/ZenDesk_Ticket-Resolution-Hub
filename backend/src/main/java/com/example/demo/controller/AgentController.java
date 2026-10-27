package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AgentProfileResponseDto;
import com.example.demo.service.AgentProfileService;

@RestController
@RequestMapping("/api/agents")
public class AgentController { 

    private final AgentProfileService agentProfileService;

    @Autowired
    public AgentController(AgentProfileService agentProfileService) {
        this.agentProfileService = agentProfileService;
    }

    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')") 
    @GetMapping
    public ResponseEntity<List<AgentProfileResponseDto>> getAllAgents() {
        List<AgentProfileResponseDto> agents = agentProfileService.getAllAgents();
        return new ResponseEntity<>(agents, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')") 
    @GetMapping("/workload")
    public ResponseEntity<List<AgentProfileResponseDto>> getAgentsByWorkload() {
        List<AgentProfileResponseDto> agents = agentProfileService.getAgentsByWorkload();
        return new ResponseEntity<>(agents, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_SUPERVISOR', 'ROLE_SUPPORT_AGENT')") 
    @GetMapping("/{id}")
    public ResponseEntity<AgentProfileResponseDto> getAgentById(@PathVariable Long id) {
        AgentProfileResponseDto agent = agentProfileService.getAgentById(id);
        return new ResponseEntity<>(agent, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')") 
    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<AgentProfileResponseDto> toggleAvailability(@PathVariable Long id) {
        AgentProfileResponseDto updatedAgent = agentProfileService.toggleAvailability(id);
        return new ResponseEntity<>(updatedAgent, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')") // Changed to hasAuthority
    @PostMapping("/{id}/recalculate")
    public ResponseEntity<AgentProfileResponseDto> recalculateCurrentLoad(@PathVariable Long id) {
        AgentProfileResponseDto updatedAgent = agentProfileService.recalculateCurrentLoad(id);
        return new ResponseEntity<>(updatedAgent, HttpStatus.OK);
    }
}