package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EscalationRequestDto {
    
    @NotNull(message = "Ticket ID is required")
    private Long ticketId;
    
    @NotBlank(message = "Reason for escalation is required")
    private String reason;

    public EscalationRequestDto() {
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}