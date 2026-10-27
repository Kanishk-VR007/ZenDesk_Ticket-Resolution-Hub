package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.AgentProfile;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.SupportTicket;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.dto.AssignmentRequestDto;
import com.example.demo.repository.AgentProfileRepository;
import com.example.demo.repository.SupportTicketRepository;
import com.example.demo.repository.TicketAssignmentRepository;

import jakarta.transaction.Transactional;

import com.example.demo.entity.Status;
import com.example.demo.entity.TicketAssignment;
@Service
public class AssignmentService {
    private final SupportTicketRepository ticketobj;
    private final TicketAssignmentRepository obj;
    private final AgentProfileRepository agentobj;
    @Autowired
    public AssignmentService(SupportTicketRepository ticketobj, 
                             TicketAssignmentRepository obj,
                             AgentProfileRepository agentobj) {
        this.ticketobj = ticketobj;
        this.obj = obj;
        this.agentobj = agentobj;
    }
    @Transactional
    public void assignTicket(AssignmentRequestDto dto,AppUser user){
       SupportTicket ticket=ticketobj.findById(dto.getTicketId()).orElseThrow(()->new ResourceNotFoundException("No Ticket available with this id"));
       if(ticket.getStatus().equals(Status.CLOSED) || ticket.getStatus().equals(Status.RESOLVED)){
        throw new BusinessValidationException("Cannot Reassign Alrady Closed Ticket or Reoslve Ticket");
       }
       AgentProfile agent=agentobj.findById(dto.getAgentId()).orElseThrow(()-> new ResourceNotFoundException("No agent avaialable with this id"));
       if(!agent.isAvailable()){
        throw new BusinessValidationException("No Agent is avaialble at this time");
       }
       if(agent.getCurrentLoad()>=agent.getMaxCapacity()){
        throw new BusinessValidationException("No agent is available free at this time");
       }
       obj.findByTicketIdAndIsActiveTrue(ticket.getId()).ifPresent(oldAssignment->{
        oldAssignment.setisActive(false);
        obj.save(oldAssignment);
        AgentProfile getoldagent=oldAssignment.getAgent();
        getoldagent.setCurrentLoad(getoldagent.getCurrentLoad()-1);
        agentobj.save(getoldagent);
       });
       TicketAssignment newAssignment = new TicketAssignment();
        newAssignment.setTicket(ticket);
        newAssignment.setAgent(agent);
        newAssignment.setAssignedBy(user);
        newAssignment.setisActive(true);
        obj.save(newAssignment);
        agent.setCurrentLoad(agent.getCurrentLoad()+1);
        agentobj.save(agent);

        if(ticket.getStatus()==Status.OPEN || ticket.getStatus()==Status.ESCALATED){
            ticket.setStatus(Status.IN_PROGRESS);
        }
        ticketobj.save(ticket);
    }

    @Transactional
    public String autoAssignTicket(Long ticketid,AppUser user){
        List<AgentProfile> agents=agentobj.findLeastLoadedAgent();
        AgentProfile lessloadagent=agents.get(0);
        AssignmentRequestDto newassignment=new AssignmentRequestDto();
        newassignment.setAgentId(lessloadagent.getId());
        newassignment.setTicketId(ticketid);
        assignTicket(newassignment, user);
        return "Ticket is auto Assigned sucessfully";
    }
    @Transactional
    public void unassignTicket(Long ticketId) {
        SupportTicket ticket = ticketobj.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("No ticket found with ID: " + ticketId));

        TicketAssignment activeAssignment = obj.findByTicketIdAndIsActiveTrue(ticketId)
                .orElseThrow(() -> new BusinessValidationException("No active assignment found for this ticket."));
        activeAssignment.setisActive(false);
        obj.save(activeAssignment);
        AgentProfile agent = activeAssignment.getAgent();
        agent.setCurrentLoad(agent.getCurrentLoad() - 1);
        agentobj.save(agent);
        
        ticket.setStatus(Status.OPEN);
        ticketobj.save(ticket);
    } 
}
