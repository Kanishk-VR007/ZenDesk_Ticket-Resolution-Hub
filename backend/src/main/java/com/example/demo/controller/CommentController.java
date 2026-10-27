package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CommentRequestDto;
import com.example.demo.dto.CommentResponseDto;
import com.example.demo.entity.AppUser;
import com.example.demo.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequestDto dto,
            @AuthenticationPrincipal AppUser user) {
        
        CommentResponseDto response = commentService.addComment(ticketId, dto, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<List<CommentResponseDto>> getTicketComments(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal AppUser user) {
        
        List<CommentResponseDto> comments = commentService.getComments(ticketId, user);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPPORT_AGENT', 'ROLE_SUPERVISOR')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal AppUser requestor) {
        
        commentService.deleteComment(commentId, requestor);
        return ResponseEntity.noContent().build();
    }
}