package com.supermarket.stockmanagement.repository;

import com.supermarket.stockmanagement.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByProductId(String productId);
    List<Transaction> findByType(Transaction.TransactionType type);
}
