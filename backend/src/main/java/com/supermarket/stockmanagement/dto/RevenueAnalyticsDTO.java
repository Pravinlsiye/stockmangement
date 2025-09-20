package com.supermarket.stockmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueAnalyticsDTO {
    private Double todayRevenue;
    private Double weekRevenue;
    private Double monthRevenue;
    private Double todayProfit;
    private Double weekProfit;
    private Double monthProfit;
    private Integer todayTransactions;
    private Integer weekTransactions;
    private Integer monthTransactions;
}
