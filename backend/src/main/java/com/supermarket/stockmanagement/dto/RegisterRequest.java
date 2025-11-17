package com.supermarket.stockmanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User registration request")
public class RegisterRequest {
    @Schema(description = "Username", example = "johndoe", required = true)
    private String username;
    
    @Schema(description = "Password (minimum 6 characters)", example = "password123", required = true)
    private String password;
    
    @Schema(description = "Email address", example = "john.doe@example.com", required = true)
    private String email;
}

