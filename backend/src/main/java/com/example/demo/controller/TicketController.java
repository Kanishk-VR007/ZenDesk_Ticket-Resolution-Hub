package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.StatusUpdateRequestDto;
import com.example.demo.dto.TicketRequestDto;
import com.example.demo.dto.TicketResponseDto;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.Role;
import com.example.demo.entity.Status;
import com.example.demo.service.TicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<TicketResponseDto> createTicket(
            @Valid @RequestBody TicketRequestDto dto, 
            @AuthenticationPrincipal AppUser creator) {
        return new ResponseEntity<>(ticketService.createTicket(dto, creator), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR', 'ROLE_ADMIN')")
    public ResponseEntity<List<TicketResponseDto>> getAllTickets(@AuthenticationPrincipal AppUser user) {
        List<TicketResponseDto> tickets;
        if (user.getRole() == Role.ROLE_CUSTOMER) {
            tickets = ticketService.getTicketsByCreator(user.getId());
        } else if (user.getRole() == Role.ROLE_SUPPORT_AGENT) {
            tickets = ticketService.getTicketsByAgent(user.getId());
        } else {
            tickets = ticketService.getAllTickets();
        }
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR', 'ROLE_ADMIN')")
    public ResponseEntity<TicketResponseDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<TicketResponseDto> updateStatus(
            @PathVariable Long id, 
            @Valid @RequestBody StatusUpdateRequestDto dto) {
        return ResponseEntity.ok(ticketService.updateStatus(id, dto));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<List<TicketResponseDto>> getTicketsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteTicketAdmin(@PathVariable Long id) {
        return ResponseEntity.ok("Ticket deleted");
    }
}