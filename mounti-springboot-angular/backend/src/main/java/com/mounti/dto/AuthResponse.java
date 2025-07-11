package com.mounti.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDto user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}