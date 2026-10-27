package com.example.demo.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="ticket_assignments")
public class TicketAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name="ticket_id",nullable = false)
    private SupportTicket ticket;
    @ManyToOne
    @JoinColumn(name="agent_id",nullable=false)
    private AgentProfile agent;
    @ManyToOne
    private AppUser assignedBy;
    private LocalDateTime assignedAt;
    private boolean isActive=true;
    @PrePersist
    void prePersist(){
        this.assignedAt=LocalDateTime.now();
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
    public AgentProfile getAgent() {
        return agent;
    }
    public void setAgent(AgentProfile agent) {
        this.agent = agent;
    }
    public AppUser getAssignedBy() {
        return assignedBy;
    }
    public void setAssignedBy(AppUser assignedBy) {
        this.assignedBy = assignedBy;
    }
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    public void setisActive(boolean isActive){
        this.isActive=isActive;
    }
    public boolean getisActive() {
        return isActive;
    }
    public TicketAssignment(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    public TicketAssignment(SupportTicket ticket, AgentProfile agent, AppUser assignedBy, boolean isActive) {
        this.ticket = ticket;
        this.agent = agent;
        this.assignedBy = assignedBy;
        this.isActive = isActive;
    }
    public TicketAssignment() {
    }
    
}
