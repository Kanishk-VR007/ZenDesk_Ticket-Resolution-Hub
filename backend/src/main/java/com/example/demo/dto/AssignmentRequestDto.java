package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentRequestDto {
    @NotNull
    private Long TicketId;
    @NotNull
    private Long agentId;
    public Long getTicketId() {
        return TicketId;
    }
    public void setTicketId(Long ticketId) {
        TicketId = ticketId;
    }
    public Long getAgentId() {
        return agentId;
    }
    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }
}
