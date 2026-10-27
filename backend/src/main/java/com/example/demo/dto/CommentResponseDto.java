package com.example.demo.dto;

import java.time.LocalDateTime;

public class CommentResponseDto {
    private Long id;
    private Long ticketId;
    private String ticketTitle;
    private String authorName;
    private String authorRole;
    private String content;
    private boolean isInternal;
    private LocalDateTime resolvedAt;
    public CommentResponseDto(long id,Long ticketId,String ticketTitle,String authorName,String authorRole,String content, LocalDateTime resolvedAt,
            boolean isInternal) {
                this.id=id;
                this.ticketId=ticketId;
                this.ticketTitle=ticketTitle;
                this.authorName=authorName;
                this.authorRole=authorRole;
                this.content=content;
                this.isInternal=isInternal;
                this.resolvedAt=resolvedAt;
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
    public String getAuthorName() {
        return authorName;
    }
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    public String getAuthorRole() {
        return authorRole;
    }
    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
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
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    public CommentResponseDto() {
    }
    
}
