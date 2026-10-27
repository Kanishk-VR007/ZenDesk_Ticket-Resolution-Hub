package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CommentRequestDto;
import com.example.demo.dto.CommentResponseDto;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.Role;
import com.example.demo.entity.SupportTicket;
import com.example.demo.entity.Status;
import com.example.demo.entity.TicketComment;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SupportTicketRepository;
import com.example.demo.repository.TicketCommentRepository;

@Service
public class CommentService {

    @Autowired
    private TicketCommentRepository commentRepository;

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Transactional
    public CommentResponseDto addComment(Long ticketId, CommentRequestDto dto, AppUser author) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        if (ticket.getStatus() == Status.CLOSED) {
            throw new BusinessValidationException("Cannot add comments to a CLOSED ticket.");
        }

        boolean internalFlag = dto.isInternal();
        if (author.getRole() == Role.ROLE_CUSTOMER) {
            internalFlag = false;
        }

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuther(author);
        comment.setContent(dto.getContent());
        comment.setInternal(internalFlag);
        TicketComment savedComment = commentRepository.save(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return mapToDto(savedComment);
    }

    public List<CommentResponseDto> getComments(Long ticketId, AppUser viewer) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        List<TicketComment> comments = commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId());
        if (viewer.getRole() == Role.ROLE_CUSTOMER) {
            comments = comments.stream()
                    .filter(c -> !c.isInternal())
                    .collect(Collectors.toList());
        }
        return comments.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, AppUser requestor) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        boolean isAuthor = comment.getAuther().getId().equals(requestor.getId());
        boolean isSupervisor = requestor.getRole() == Role.ROLE_SUPERVISOR;

        if (!isAuthor && !isSupervisor) {
            throw new BusinessValidationException("You do not have permission to delete this comment.");
        }

        commentRepository.delete(comment);
    }
    private CommentResponseDto mapToDto(TicketComment comment) {
        CommentResponseDto response = new CommentResponseDto();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setInternal(comment.isInternal());
        response.setResolvedAt(comment.getCreatedAt());
        if (comment.getTicket() != null) {
            response.setTicketId(comment.getTicket().getId());
            response.setTicketTitle(comment.getTicket().getTitle());
        }
        if (comment.getAuther() != null) {
            response.setAuthorName(comment.getAuther().getFullName());
            
            if (comment.getAuther().getRole() != null) {
                response.setAuthorRole(comment.getAuther().getRole().name());
            }
        }

        return response;
    }
}