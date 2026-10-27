package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TicketComment;

public interface TicketCommentRepository extends JpaRepository<TicketComment,Long>{
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long id);
    List<TicketComment> findByTicketIdAndIsInternalFalseOrderByCreatedAtAsc(Long ticketId);
    Long countByTicketId(Long ticketId);
}
