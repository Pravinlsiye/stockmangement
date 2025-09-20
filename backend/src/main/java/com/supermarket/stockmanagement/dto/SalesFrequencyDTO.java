package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesFrequencyDTO {
    private LocalDate date;
    private Long count;
    private Double totalAmount;
}
