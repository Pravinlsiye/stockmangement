package com.supermarket.stockmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientStock(InsufficientStockException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "INSUFFICIENT_STOCK");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("productId", ex.getProductId());
        errorResponse.put("productName", ex.getProductName());
        errorResponse.put("availableStock", ex.getAvailableStock());
        errorResponse.put("requestedQuantity", ex.getRequestedQuantity());
        errorResponse.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        // Don't handle auth-related exceptions here - let AuthController handle them
        // This handler will catch other RuntimeExceptions
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "INTERNAL_ERROR");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
