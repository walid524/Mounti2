package com.mounti.dto;

import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String email;
    private String name;
    private Boolean isTransporter;
    private LocalDateTime createdAt;
    
    // Constructors
    public UserDto() {}
    
    public UserDto(String id, String email, String name, Boolean isTransporter, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isTransporter = isTransporter;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Boolean getIsTransporter() { return isTransporter; }
    public void setIsTransporter(Boolean isTransporter) { this.isTransporter = isTransporter; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}