package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.model.Product;
import com.supermarket.stockmanagement.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> getProductsBySupplierId(String supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }
    
    public List<Product> getLowStockProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStockLevel())
                .toList();
    }
    
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        if (product.getCurrentStock() == null) {
            product.setCurrentStock(0);
        }
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product product) {
        product.setId(id);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    public Product updateStock(String productId, Integer quantity, boolean isAddition) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (isAddition) {
                product.setCurrentStock(product.getCurrentStock() + quantity);
            } else {
                product.setCurrentStock(product.getCurrentStock() - quantity);
            }
            product.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found");
    }
}
