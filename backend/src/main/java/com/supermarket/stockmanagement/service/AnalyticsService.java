package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.dto.*;
import com.supermarket.stockmanagement.model.Category;
import com.supermarket.stockmanagement.model.Product;
import com.supermarket.stockmanagement.model.Transaction;
import com.supermarket.stockmanagement.model.Transaction.TransactionType;
import com.supermarket.stockmanagement.repository.ProductRepository;
import com.supermarket.stockmanagement.repository.TransactionRepository;
import com.supermarket.stockmanagement.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductService productService;

    public List<SalesFrequencyDTO> getSalesFrequency(int days) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);
        
        List<Transaction> sales = transactionRepository.findAll().stream()
            .filter(t -> t.getType() == TransactionType.SALE)
            .filter(t -> t.getTransactionDate() != null && 
                        t.getTransactionDate().isAfter(startDate) && 
                        t.getTransactionDate().isBefore(endDate))
            .collect(Collectors.toList());

        Map<LocalDate, List<Transaction>> salesByDate = sales.stream()
            .collect(Collectors.groupingBy(t -> t.getTransactionDate().toLocalDate()));

        List<SalesFrequencyDTO> frequency = new ArrayList<>();
        LocalDate currentDate = startDate.toLocalDate();
        
        while (!currentDate.isAfter(endDate.toLocalDate())) {
            List<Transaction> dailySales = salesByDate.getOrDefault(currentDate, new ArrayList<>());
            long count = dailySales.size();
            double totalAmount = dailySales.stream()
                .mapToDouble(Transaction::getTotalAmount)
                .sum();
            
            frequency.add(new SalesFrequencyDTO(currentDate, count, totalAmount));
            currentDate = currentDate.plusDays(1);
        }
        
        return frequency;
    }

    public List<ProductSalesTrendDTO> getProductSalesTrends() {
        List<Product> products = productRepository.findAll();
        List<ProductSalesTrendDTO> trends = new ArrayList<>();
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        for (Product product : products) {
            List<Transaction> productSales = transactionRepository.findAll().stream()
                .filter(t -> t.getType() == TransactionType.SALE)
                .filter(t -> t.getProductId().equals(product.getId()))
                .filter(t -> t.getTransactionDate() != null && 
                            t.getTransactionDate().isAfter(thirtyDaysAgo))
                .collect(Collectors.toList());
            
            if (productSales.isEmpty()) {
                continue;
            }
            
            int totalSold = productSales.stream()
                .mapToInt(Transaction::getQuantity)
                .sum();
            
            double averageDailySales = totalSold / 30.0;
            
            Integer daysUntilStockout = null;
            LocalDate suggestedOrderDate = null;
            Integer suggestedOrderQuantity = null;
            
            if (averageDailySales > 0) {
                daysUntilStockout = (int) (product.getCurrentStock() / averageDailySales);
                
                // Suggest reorder when stock will last only 7 more days
                if (daysUntilStockout <= 7) {
                    suggestedOrderDate = LocalDate.now();
                    // Order enough for 30 days based on average sales
                    suggestedOrderQuantity = (int) Math.ceil(averageDailySales * 30);
                } else {
                    suggestedOrderDate = LocalDate.now().plusDays(daysUntilStockout - 7);
                    suggestedOrderQuantity = (int) Math.ceil(averageDailySales * 30);
                }
            }
            
            ProductSalesTrendDTO trend = new ProductSalesTrendDTO(
                product.getId(),
                product.getName(),
                product.getCurrentStock(),
                totalSold,
                averageDailySales,
                daysUntilStockout,
                suggestedOrderDate,
                suggestedOrderQuantity
            );
            
            trends.add(trend);
        }
        
        // Sort by urgency (days until stockout)
        trends.sort(Comparator.comparing(ProductSalesTrendDTO::getDaysUntilStockout, 
                                       Comparator.nullsLast(Comparator.naturalOrder())));
        
        return trends;
    }

    public List<TopProductDTO> getTopProducts(int limit) {
        try {
            Map<String, Integer> productSalesCount = new HashMap<>();
            Map<String, Double> productRevenue = new HashMap<>();
            
            // Get all sales transactions
            List<Transaction> recentSales = transactionRepository.findAll().stream()
                .filter(t -> t.getType() == TransactionType.SALE)
                .filter(t -> t.getTransactionDate() != null)
                .collect(Collectors.toList());
            
            // Aggregate sales by product
            for (Transaction sale : recentSales) {
                String productId = sale.getProductId();
                if (productId != null) {
                    productSalesCount.merge(productId, sale.getQuantity(), Integer::sum);
                    productRevenue.merge(productId, sale.getTotalAmount(), Double::sum);
                }
            }
            
            List<TopProductDTO> topProducts = new ArrayList<>();
            
            // Create DTOs for each product
            for (Map.Entry<String, Integer> entry : productSalesCount.entrySet()) {
                String productId = entry.getKey();
                try {
                    Product product = productRepository.findById(productId).orElse(null);
                    
                    if (product != null) {
                        String categoryName = "Uncategorized";
                        // Look up category by ID since Product only stores categoryId
                        if (product.getCategoryId() != null) {
                            var category = categoryRepository.findById(product.getCategoryId()).orElse(null);
                            if (category != null && category.getName() != null && !category.getName().isEmpty()) {
                                categoryName = category.getName();
                            }
                        }
                        
                        TopProductDTO dto = new TopProductDTO(
                            productId,
                            product.getName(),
                            entry.getValue(),
                            productRevenue.getOrDefault(productId, 0.0),
                            categoryName
                        );
                        topProducts.add(dto);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing product " + productId + ": " + e.getMessage());
                }
            }
            
            // Sort by revenue descending
            topProducts.sort(Comparator.comparing(TopProductDTO::getRevenue).reversed());
            
            return topProducts.stream().limit(limit).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getTopProducts: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public RevenueAnalyticsDTO getRevenueAnalytics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minusDays(7);
        LocalDateTime monthStart = now.minusDays(30);
        
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        // Today's metrics
        List<Transaction> todaySales = filterSalesByDateRange(allTransactions, todayStart, now);
        double todayRevenue = calculateRevenue(todaySales);
        double todayProfit = calculateProfit(todaySales);
        int todayTransactions = todaySales.size();
        
        // Week metrics
        List<Transaction> weekSales = filterSalesByDateRange(allTransactions, weekStart, now);
        double weekRevenue = calculateRevenue(weekSales);
        double weekProfit = calculateProfit(weekSales);
        int weekTransactions = weekSales.size();
        
        // Month metrics
        List<Transaction> monthSales = filterSalesByDateRange(allTransactions, monthStart, now);
        double monthRevenue = calculateRevenue(monthSales);
        double monthProfit = calculateProfit(monthSales);
        int monthTransactions = monthSales.size();
        
        return new RevenueAnalyticsDTO(
            todayRevenue, weekRevenue, monthRevenue,
            todayProfit, weekProfit, monthProfit,
            todayTransactions, weekTransactions, monthTransactions
        );
    }
    
    private List<Transaction> filterSalesByDateRange(List<Transaction> transactions, 
                                                     LocalDateTime start, 
                                                     LocalDateTime end) {
        return transactions.stream()
            .filter(t -> t.getType() == TransactionType.SALE)
            .filter(t -> t.getTransactionDate() != null)
            .filter(t -> t.getTransactionDate().isAfter(start) && 
                        t.getTransactionDate().isBefore(end))
            .collect(Collectors.toList());
    }
    
    private double calculateRevenue(List<Transaction> sales) {
        return sales.stream()
            .mapToDouble(Transaction::getTotalAmount)
            .sum();
    }
    
    private double calculateProfit(List<Transaction> sales) {
        double totalProfit = 0;
        
        for (Transaction sale : sales) {
            Product product = productRepository.findById(sale.getProductId()).orElse(null);
            if (product != null) {
                double profit = (sale.getUnitPrice() - product.getPurchasePrice()) * sale.getQuantity();
                totalProfit += profit;
            }
        }
        
        return totalProfit;
    }
}
