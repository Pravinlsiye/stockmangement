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
        transaction.setTotalAmount(transaction.getQuantity() * transaction.getUnitPrice());
        
        // Update product stock based on transaction type
        boolean isAddition = transaction.getType() == Transaction.TransactionType.PURCHASE;
        productService.updateStock(transaction.getProductId(), transaction.getQuantity(), isAddition);
        
        return transactionRepository.save(transaction);
    }
    
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
