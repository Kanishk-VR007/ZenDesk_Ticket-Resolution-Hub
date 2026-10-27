package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.EscalationRecord;

public interface EscalationRecordRepository extends JpaRepository<EscalationRecord,Long>{
    List<EscalationRecord> findByTicketId(Long ticketId);
    List<EscalationRecord> findByIsResolvedFalse();
    long countByTicketId(Long ticketId);
}
