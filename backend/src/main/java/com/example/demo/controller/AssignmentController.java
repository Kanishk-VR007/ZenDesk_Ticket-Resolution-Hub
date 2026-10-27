package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AssignmentRequestDto;
import com.example.demo.entity.AppUser;
import com.example.demo.service.AssignmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')")
    public ResponseEntity<String> assignTicket(
            @Valid @RequestBody AssignmentRequestDto dto,
            @AuthenticationPrincipal AppUser supervisor) {
        
        assignmentService.assignTicket(dto, supervisor);
        return ResponseEntity.ok("Ticket successfully assigned.");
    }

    @PostMapping("/auto/{ticketId}")
    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')")
    public ResponseEntity<String> autoAssignTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal AppUser supervisor) {
        
        String resultMessage = assignmentService.autoAssignTicket(ticketId, supervisor);
        return ResponseEntity.ok(resultMessage);
    }

    @DeleteMapping("/{ticketId}")
    @PreAuthorize("hasAuthority('ROLE_SUPERVISOR')")
    public ResponseEntity<String> unassignTicket(@PathVariable Long ticketId) {
        assignmentService.unassignTicket(ticketId);
        return ResponseEntity.ok("Ticket successfully unassigned and moved back to OPEN status.");
    }
}