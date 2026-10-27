package com.example.demo.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.EscalationRequestDto;
import com.example.demo.dto.EscalationResponseDto;
import com.example.demo.entity.AppUser;
import com.example.demo.service.EscalationService;
import com.example.demo.service.TicketService;

@RestController
@RequestMapping("/api/escalations")
public class EscalationController {

    private final EscalationService escalationService;

    @Autowired
    public EscalationController(EscalationService escalationService) {
        this.escalationService = escalationService;
    }
    @Autowired
    TicketService ticketservice;
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPERVISOR', 'ROLE_SUPPORT_AGENT','ROLE_CUSTOMER')")
    public ResponseEntity<EscalationResponseDto> createEscalation(
            @Valid @RequestBody EscalationRequestDto requestDto,
            @AuthenticationPrincipal AppUser requestor) {
        EscalationResponseDto response = escalationService.createEscalation(requestDto, requestor);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ROLE_SUPERVISOR')")
    public ResponseEntity<EscalationResponseDto> resolveEscalation(@PathVariable Long id) {
        EscalationResponseDto response = escalationService.resolveEscalation(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<List<EscalationResponseDto>> getEscalationsByTicket(@PathVariable Long ticketId) {
        List<EscalationResponseDto> responses = escalationService.getEscalationsByTicket(ticketId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_SUPERVISOR')")
    public ResponseEntity<List<EscalationResponseDto>> getAllEscalations() {
        List<EscalationResponseDto> responses = escalationService.getAllEscalations();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/unresolved")
    @PreAuthorize("hasRole('ROLE_SUPERVISOR')")
    public ResponseEntity<List<EscalationResponseDto>> getUnresolvedEscalations() {
        List<EscalationResponseDto> responses = escalationService.getUnresolvedEscalations();
        return ResponseEntity.ok(responses);
    }
}