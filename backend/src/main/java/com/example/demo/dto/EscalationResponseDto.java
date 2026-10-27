package com.example.demo.dto;

import java.time.LocalDateTime;

public class EscalationResponseDto {
    
    private Long id;
    private Long ticketId;
    private String ticketTitle;      // <-- ADDED
    private Integer escalationLevel;
    private String reason;
    private String escalatedByName;  // <-- ADDED
    private LocalDateTime escalatedAt; // <-- RENAMED from createdAt
    private LocalDateTime resolvedAt;

    public EscalationResponseDto() {
    }

    public EscalationResponseDto(Long id, Long ticketId, String ticketTitle, Integer escalationLevel, String reason, String escalatedByName, LocalDateTime escalatedAt, LocalDateTime resolvedAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.ticketTitle = ticketTitle;
        this.escalationLevel = escalationLevel;
        this.reason = reason;
        this.escalatedByName = escalatedByName;
        this.escalatedAt = escalatedAt;
        this.resolvedAt = resolvedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketTitle() {
        return ticketTitle;
    }

    public void setTicketTitle(String ticketTitle) {
        this.ticketTitle = ticketTitle;
    }

    public Integer getEscalationLevel() {
        return escalationLevel;
    }

    public void setEscalationLevel(Integer escalationLevel) {
        this.escalationLevel = escalationLevel;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getEscalatedByName() {
        return escalatedByName;
    }

    public void setEscalatedByName(String escalatedByName) {
        this.escalatedByName = escalatedByName;
    }

    public LocalDateTime getEscalatedAt() {
        return escalatedAt;
    }

    public void setEscalatedAt(LocalDateTime escalatedAt) {
        this.escalatedAt = escalatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}