package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.exception.AuthenticationException;
import com.supermarket.stockmanagement.model.User;
import com.supermarket.stockmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService;

    public User register(String username, String password, String email) {
        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            throw new AuthenticationException("Username already exists");
        }
        
        // Email is required for login, so validate it
        if (email == null || email.isEmpty()) {
            throw new AuthenticationException("Email is required");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new AuthenticationException("Email already exists");
        }

        // Create new user with hashed password
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Hash the password
        user.setEmail(email);

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // Verify password by comparing hashed values
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        return user;
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail());
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}

