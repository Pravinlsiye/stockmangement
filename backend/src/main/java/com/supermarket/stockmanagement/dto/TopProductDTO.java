package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDTO {
    private String productId;
    private String productName;
    private Integer quantitySold;
    private Double revenue;
    private String category;
}
