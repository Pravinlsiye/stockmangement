package com.supermarket.stockmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "product_suppliers")
public class ProductSupplier {
    @Id
    private String id;
    private String productId;
    private String supplierId;
    private Double costPerUnit; // Supplier's price per unit
    private Integer deliveryDays; // Days to deliver
    private Integer minimumOrderQuantity; // Minimum order quantity
    private Boolean isPreferred; // Preferred supplier for this product
    private String notes; // Any additional notes
}
