package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="escalation_records")
public class EscalationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(referencedColumnName = "id")
    private SupportTicket ticket;
    @ManyToOne
    private AppUser escalatedBy;
    @Column(nullable = false,length = 500)
    private String reason;
    private int escalationLevel=1;
    private boolean isResolved=false;
    private LocalDateTime escalatedAt;
    private LocalDateTime resolvedAt;
    @PrePersist
    void prePersist(){
        this.escalatedAt=LocalDateTime.now();
    }
    public Long getId() {
        return id;
    }
    public SupportTicket getTicket() {
        return ticket;
    }
    public void setTicket(SupportTicket ticket) {
        this.ticket = ticket;
    }
    public AppUser getEscalatedBy() {
        return escalatedBy;
    }
    public void setEscalatedBy(AppUser escalatedBy) {
        this.escalatedBy = escalatedBy;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public int getEscalatedLevel() {
        return escalationLevel;
    }
    public void setEscalatedLevel(int escalatedLevel) {
        this.escalationLevel = escalatedLevel;
    }
    public boolean isResolved() {
        return isResolved;
    }
    public void setResolved(boolean isResolved) {
        this.isResolved = isResolved;
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
    public EscalationRecord(SupportTicket ticket, AppUser escalatedBy, String reason, int escalationLevel,
            boolean isResolved, LocalDateTime escalatedAt, LocalDateTime resolvedAt) {
        this.ticket = ticket;
        this.escalatedBy = escalatedBy;
        this.reason = reason;
        this.escalationLevel = escalationLevel;
        this.isResolved = isResolved;
        this.escalatedAt = escalatedAt;
        this.resolvedAt = resolvedAt;
    }
    public EscalationRecord() {
}
}
