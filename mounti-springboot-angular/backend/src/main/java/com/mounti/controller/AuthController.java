package com.mounti.controller;

import com.mounti.dto.*;
import com.mounti.entity.User;
import com.mounti.repository.UserRepository;
import com.mounti.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

            UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getIsTransporter(),
                user.getCreatedAt()
            );

            return ResponseEntity.ok(new AuthResponse(jwt, userDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Invalid email or password!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body("Error: Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setEmail(signUpRequest.getEmail());
        user.setName(signUpRequest.getName());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setIsTransporter(signUpRequest.getIsTransporter());

        User result = userRepository.save(user);

        // Generate JWT token
        String jwt = tokenProvider.generateTokenFromUsername(user.getEmail());

        UserDto userDto = new UserDto(
            result.getId(),
            result.getEmail(),
            result.getName(),
            result.getIsTransporter(),
            result.getCreatedAt()
        );

        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserDto userDto = new UserDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getIsTransporter(),
            user.getCreatedAt()
        );

        return ResponseEntity.ok(userDto);
    }
}