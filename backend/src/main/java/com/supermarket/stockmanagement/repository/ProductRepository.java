package com.supermarket.stockmanagement.repository;

import com.supermarket.stockmanagement.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String categoryId);
    List<Product> findBySupplierId(String supplierId);
    List<Product> findByCurrentStockLessThanEqual(Integer stock);
}
