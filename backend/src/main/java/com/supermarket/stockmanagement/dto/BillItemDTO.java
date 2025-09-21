package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillItemDTO {
    private String productId;
    private String productName;
    private String productCode;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}
