package com.supermarket.stockmanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Login request with email and password")
public class LoginRequest {
    @Schema(description = "User email address", example = "user@example.com", required = true)
    private String email;
    
    @Schema(description = "User password", example = "password123", required = true)
    private String password;
}

