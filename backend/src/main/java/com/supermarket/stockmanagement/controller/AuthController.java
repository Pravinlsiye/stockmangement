package com.supermarket.stockmanagement.controller;

import com.supermarket.stockmanagement.dto.AuthResponse;
import com.supermarket.stockmanagement.dto.LoginRequest;
import com.supermarket.stockmanagement.dto.RegisterRequest;
import com.supermarket.stockmanagement.exception.AuthenticationException;
import com.supermarket.stockmanagement.model.User;
import com.supermarket.stockmanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail()
            );

            AuthResponse response = new AuthResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setMessage("User registered successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (AuthenticationException e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());

            AuthResponse response = new AuthResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setMessage("Login successful");

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}

