package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
public class AuthRequestDto {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AuthRequestDto() {
    }

    public AuthRequestDto(@NotBlank(message = "Email is required") String email,
            @NotBlank(message = "Password is required") String password) {
        this.email = email;
        this.password = password;
    }
    
}