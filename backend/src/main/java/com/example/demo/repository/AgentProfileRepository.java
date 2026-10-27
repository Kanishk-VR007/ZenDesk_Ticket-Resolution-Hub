package com.example.demo.repository;


import com.example.demo.entity.AgentProfile;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
 public interface AgentProfileRepository extends JpaRepository<AgentProfile,Long>{
 
    Optional<AgentProfile> findByUserId(Long id);
    @Query("SELECT a FROM AgentProfile a WHERE a.isAvailable = true AND a.currentLoad < a.maxCapacity ORDER BY a.currentLoad ASC")
   List<AgentProfile> findLeastLoadedAgent();
 }  
    
