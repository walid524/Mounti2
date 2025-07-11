package com.mounti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String password;
    
    @NotBlank
    @Size(min = 2)
    private String name;
    
    private Boolean isTransporter = false;
    
    // Constructors
    public RegisterRequest() {}
    
    public RegisterRequest(String email, String password, String name, Boolean isTransporter) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.isTransporter = isTransporter;
    }
    
    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Boolean getIsTransporter() { return isTransporter; }
    public void setIsTransporter(Boolean isTransporter) { this.isTransporter = isTransporter; }
}