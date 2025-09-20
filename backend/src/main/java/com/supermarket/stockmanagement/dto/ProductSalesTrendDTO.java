package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesTrendDTO {
    private String productId;
    private String productName;
    private Integer currentStock;
    private Integer totalSold;
    private Double averageDailySales;
    private Integer daysUntilStockout;
    private LocalDate suggestedOrderDate;
    private Integer suggestedOrderQuantity;
}
