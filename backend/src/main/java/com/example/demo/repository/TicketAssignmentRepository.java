package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TicketAssignment;
public interface TicketAssignmentRepository extends JpaRepository<TicketAssignment,Long>{
Optional<TicketAssignment> findByTicketIdAndIsActiveTrue(Long ticketId);
 List<TicketAssignment> findByAgentIdAndIsActiveTrue(Long agentId);
     long countByAgentIdAndIsActiveTrue(Long agentId); 
} 
