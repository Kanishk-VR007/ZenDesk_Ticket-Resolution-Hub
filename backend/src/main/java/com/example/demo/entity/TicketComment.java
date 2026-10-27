package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ticket_comments")
public class TicketComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name="ticket_id",nullable = false)
    private SupportTicket ticket;
    @ManyToOne
    private AppUser author;
    @Column(columnDefinition = "TEXT",nullable = false)
    private String content;
    private boolean isInternal=false;
    private LocalDateTime createdAt;
    public long getId() {
        return id;
    }
    public SupportTicket getTicket() {
        return ticket;
    }
    public void setTicket(SupportTicket ticket) {
        this.ticket = ticket;
    }
    public AppUser getAuther() {
        return author;
    }
    public void setAuther(AppUser author) {
        this.author = author;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public boolean isInternal() {
        return isInternal;
    }
    public void setInternal(boolean isInternal) {
        this.isInternal = isInternal;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public TicketComment(SupportTicket ticket, AppUser author, String content, boolean isInternal,
            LocalDateTime createdAt) {
        this.ticket = ticket;
        this.author = author;
        this.content = content;
        this.isInternal = isInternal;
        this.createdAt = createdAt;
    }
    public TicketComment() {
    }
}
