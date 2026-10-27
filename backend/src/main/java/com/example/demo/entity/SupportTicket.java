package com.example.demo.entity;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="support_tickets")
 public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT",nullable =false)
    private String description;
    @Column(length = 100)
    private String category;
    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Status status=Status.OPEN;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority=Priority.MEDIUM;
    @ManyToOne
    private AppUser creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime slaDeadline;
    @OneToMany(mappedBy = "ticket",cascade = CascadeType.ALL)
    private List<TicketComment> comments=new ArrayList<>();
    @OneToMany(mappedBy = "ticket",cascade = CascadeType.ALL)
    private List<TicketAssignment> assignments=new ArrayList<>();
    @OneToMany(mappedBy = "ticket",cascade = CascadeType.ALL)
    private List<EscalationRecord> escalations=new ArrayList<>();
    @PrePersist
    void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
    void setTicketComment(TicketComment Comments){
        comments.add(Comments);
        Comments.setTicket(this);
    }
    void setAssignments(TicketAssignment Assignments){
        assignments.add(Assignments);
        Assignments.setTicket(this);
    }
    void setEscalations(EscalationRecord EscalationRecord){
        escalations.add(EscalationRecord);
        EscalationRecord.setTicket(this);
    }
    public long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public AppUser getCreator() {
        return creator;
    }
    public void setCreator(AppUser creator) {
        this.creator = creator;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt){
        this.updatedAt=updatedAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    public LocalDateTime getSlaDeadline() {
        return slaDeadline;
    }
    public void setSlaDeadline(LocalDateTime slaDeadline) {
        this.slaDeadline = slaDeadline;
    }
    public void setPriority(Priority priority){
        this.priority=priority;
    }
    public Priority getPriority(){
        return priority;
    }
    public List<TicketComment> getComments() {
        return comments;
    }
    public List<TicketAssignment> getAssignments() {
        return assignments;
    }
    public List<EscalationRecord> getEscalations() {
        return escalations;
    }
    public SupportTicket() {
    }
    public SupportTicket(String title, String description, String category, Status status, Priority priority,
            AppUser creator, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt,
            LocalDateTime slaDeadline, List<TicketComment> comments, List<TicketAssignment> assignments,
            List<EscalationRecord> escalations) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.status = status;
        this.priority = priority;
        this.creator = creator;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.slaDeadline = slaDeadline;
        this.comments = comments;
        this.assignments = assignments;
        this.escalations = escalations;
    }
}
