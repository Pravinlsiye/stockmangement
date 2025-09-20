package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.model.Transaction;
import com.supermarket.stockmanagement.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ProductService productService;
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }
    
    public List<Transaction> getTransactionsByProductId(String productId) {
        return transactionRepository.findByProductId(productId);
    }
    
    public List<Transaction> getTransactionsByType(Transaction.TransactionType type) {
        return transactionRepository.findByType(type);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setTotalAmount(Math.abs(transaction.getQuantity()) * transaction.getUnitPrice());
        
        // Update product stock based on transaction type
        switch (transaction.getType()) {
            case PURCHASE:
                // Purchases always add to stock
                productService.updateStock(transaction.getProductId(), Math.abs(transaction.getQuantity()), true);
                break;
            case SALE:
                // Sales always reduce stock
                productService.updateStock(transaction.getProductId(), Math.abs(transaction.getQuantity()), false);
                break;
            case ADJUSTMENT:
                // Adjustments can add (positive) or reduce (negative) stock
                boolean isAddition = transaction.getQuantity() > 0;
                productService.updateStock(transaction.getProductId(), Math.abs(transaction.getQuantity()), isAddition);
                break;
        }
        
        return transactionRepository.save(transaction);
    }
    
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
