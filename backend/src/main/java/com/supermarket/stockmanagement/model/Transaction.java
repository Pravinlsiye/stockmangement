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
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String productId;
    private TransactionType type; // PURCHASE, SALE, ADJUSTMENT
    private Integer quantity;
    private Double unitPrice;
    private Double totalAmount;
    private String reference; // invoice number, receipt number, etc.
    private String billId; // Groups multiple transactions into one bill for SALE type
    private String notes;
    private LocalDateTime transactionDate;
    
    public enum TransactionType {
        PURCHASE, SALE, ADJUSTMENT
    }
}
