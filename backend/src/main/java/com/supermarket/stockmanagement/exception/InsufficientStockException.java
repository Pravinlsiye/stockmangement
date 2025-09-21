package com.supermarket.stockmanagement.exception;

public class InsufficientStockException extends RuntimeException {
    private final String productId;
    private final String productName;
    private final Integer availableStock;
    private final Integer requestedQuantity;
    
    public InsufficientStockException(String productId, String productName, Integer availableStock, Integer requestedQuantity) {
        super(String.format("Insufficient stock for product '%s'. Available: %d, Requested: %d", 
                           productName, availableStock, requestedQuantity));
        this.productId = productId;
        this.productName = productName;
        this.availableStock = availableStock;
        this.requestedQuantity = requestedQuantity;
    }
    
    public String getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public Integer getAvailableStock() {
        return availableStock;
    }
    
    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }
}
