package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.SupportTicket;
import com.example.demo.entity.Status;
import com.example.demo.entity.Priority;

public interface SupportTicketRepository extends JpaRepository<SupportTicket,Long> {
    
    List<SupportTicket> findByStatus(Status status);
    
    List<SupportTicket> findByCreatorId(Long creatorId);
    
    List<SupportTicket> findByPriority(Priority priority);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.slaDeadline < :deadline AND t.status NOT IN ('RESOLVED', 'CLOSED')")
    List<SupportTicket> findTicketsAtSlaRisk(@Param("deadline") LocalDateTime deadline);
    
    long countByStatus(Status status);
    
    long countByCreatorId(Long creatorId);
    @Query("SELECT t FROM SupportTicket t WHERE t.category = :category AND t.status <> 'CLOSED'")
    List<SupportTicket> findOpenByCategory(@Param("category") String category);
}