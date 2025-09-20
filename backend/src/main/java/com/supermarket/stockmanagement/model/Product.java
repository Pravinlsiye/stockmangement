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
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private String barcode;
    private String categoryId;
    private String supplierId;
    private Double purchasePrice;
    private Double sellingPrice;
    private Integer currentStock;
    private Integer minStockLevel;
    private String unit; // e.g., "piece", "kg", "liter"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
