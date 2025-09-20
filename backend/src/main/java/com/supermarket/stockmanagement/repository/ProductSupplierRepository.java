package com.supermarket.stockmanagement.repository;

import com.supermarket.stockmanagement.model.ProductSupplier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSupplierRepository extends MongoRepository<ProductSupplier, String> {
    List<ProductSupplier> findByProductId(String productId);
    List<ProductSupplier> findBySupplierId(String supplierId);
    List<ProductSupplier> findByProductIdAndIsPreferredTrue(String productId);
}
