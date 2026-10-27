package com.example.demo.config;

import com.example.demo.entity.AppUser;
import com.example.demo.entity.Role;
import com.example.demo.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (appUserRepository.count() == 0) {
            AppUser supervisor = new AppUser();
            supervisor.setFullName("Admin Supervisor");
            supervisor.setEmail("supervisor@test.com");
            supervisor.setPassword(passwordEncoder.encode("password123"));
            supervisor.setRole(Role.ROLE_SUPERVISOR);
            supervisor.setActive(true);
            appUserRepository.save(supervisor);
            AppUser agent = new AppUser();
            agent.setFullName("John Agent");
            agent.setEmail("agent@test.com");
            agent.setPassword(passwordEncoder.encode("password123"));
            agent.setRole(Role.ROLE_SUPPORT_AGENT);
            agent.setActive(true);
            appUserRepository.save(agent);
            AppUser customer = new AppUser();
            customer.setFullName("Jane Customer");
            customer.setEmail("customer@test.com");
            customer.setPassword(passwordEncoder.encode("password123"));
            customer.setRole(Role.ROLE_CUSTOMER);
            customer.setActive(true);
            appUserRepository.save(customer);
            System.out.println("Data Seeding Complete: Default users created successfully!");
        }
    }
}