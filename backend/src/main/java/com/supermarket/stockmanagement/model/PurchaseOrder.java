package com.supermarket.stockmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "purchase_orders")
public class PurchaseOrder {
    @Id
    private String id;
    private String orderNumber; // Auto-generated PO-YYYYMMDD-XXX
    private String productId;
    private String productName;
    private String supplierId;
    private String supplierName;
    private Integer quantity;
    private Double unitPrice;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String notes;
    private String createdBy;
    
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }
    
    public enum PaymentStatus {
        PENDING,
        PARTIAL,
        PAID,
        REFUNDED
    }
}
