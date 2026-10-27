package com.example.demo.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
@Entity
@Table(name="agent_profiles")
public class AgentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @OneToOne
    @JoinColumn(name="user_id",unique=true,nullable = false)
    private AppUser user;
    private String department;
    private String specialization;
    private int currentLoad=0;
    private int maxCapacity=5;
    private boolean isAvailable=true;
    public Long getId() {
        return id;
    }
    public AppUser getUser() {
        return user;
    }
    public void setUser(AppUser user) {
        this.user = user;
    }
    public String getDepartment() {
        return department;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    public int getCurrentLoad() {
        return currentLoad;
    }
    public void setCurrentLoad(int currentLoad) {
        this.currentLoad = currentLoad;
    }
    public int getMaxCapacity() {
        return maxCapacity;
    }
    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    public boolean isAvailable() {
        return isAvailable;
    }
    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    public AgentProfile( AppUser user, String department, String specialization, int currentLoad,
            int maxCapacity, boolean isAvailable) {
        this.user = user;
        this.department = department;
        this.specialization = specialization;
        this.currentLoad = currentLoad;
        this.maxCapacity = maxCapacity;
        this.isAvailable = isAvailable;
    }
    public AgentProfile() {
    }
    
}
