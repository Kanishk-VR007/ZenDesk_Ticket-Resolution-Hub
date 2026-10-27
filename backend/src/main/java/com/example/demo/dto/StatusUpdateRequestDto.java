package com.example.demo.dto;

import com.example.demo.entity.Status;

import jakarta.validation.constraints.NotNull;


public class StatusUpdateRequestDto {
    
    @NotNull(message = "Status cannot be null")
    private Status status;
    public Status getStatus(){
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    
}