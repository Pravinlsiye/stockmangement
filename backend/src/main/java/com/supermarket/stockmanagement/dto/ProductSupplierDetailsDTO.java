package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSupplierDetailsDTO {
    private String productSupplierId;
    private String supplierId;
    private String supplierName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private Double costPerUnit;
    private Integer deliveryDays;
    private Integer minimumOrderQuantity;
    private Boolean isPreferred;
    private String notes;
    
    // Calculated fields
    private Double totalCostForMinOrder; // costPerUnit * minimumOrderQuantity
}
