package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.AgentProfile;
import com.example.demo.entity.AppUser;
import com.example.demo.entity.Role;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.AgentProfileRepository;
import com.example.demo.repository.AppUserRepository;

@Service
public class AuthService {
    @Autowired
    AgentProfileRepository agentProfileRepository;

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(AppUserRepository repository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    public AuthResponseDto register(RegisterRequestDto request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessValidationException("Email is already registered.");
        }
        AppUser user = new AppUser();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(true);
        repository.save(user);
        String jwtToken = jwtService.generateToken(user);
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(jwtToken);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        if (user.getRole() == Role.ROLE_SUPPORT_AGENT || user.getRole() == Role.ROLE_SUPERVISOR) {
        AgentProfile profile = new AgentProfile();
        
        profile.setUser(user); 
        profile.setAvailable(true);
        profile.setCurrentLoad(0);
        profile.setMaxCapacity(5); 
        profile.setDepartment("General Support"); 
        agentProfileRepository.save(profile);
    }
        return response;
    }

    public AuthResponseDto login(AuthRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        AppUser user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessValidationException("Invalid email or password."));
        String jwtToken = jwtService.generateToken(user);
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(jwtToken);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());
        return response;
    }
}