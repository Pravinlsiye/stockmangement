package com.supermarket.stockmanagement.controller;

import com.supermarket.stockmanagement.dto.*;
import com.supermarket.stockmanagement.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:4200")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/sales-frequency")
    public ResponseEntity<List<SalesFrequencyDTO>> getSalesFrequency(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getSalesFrequency(days));
    }

    @GetMapping("/product-trends")
    public ResponseEntity<List<ProductSalesTrendDTO>> getProductSalesTrends() {
        return ResponseEntity.ok(analyticsService.getProductSalesTrends());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopProducts(limit));
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueAnalyticsDTO> getRevenueAnalytics() {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics());
    }
}
