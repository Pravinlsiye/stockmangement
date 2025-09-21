package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillDTO {
    private String billId;
    private LocalDateTime billDate;
    private Integer totalItems;
    private Double totalAmount;
    private List<BillItemDTO> items;
}
