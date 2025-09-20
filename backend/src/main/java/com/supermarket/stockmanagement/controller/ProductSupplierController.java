package com.supermarket.stockmanagement.controller;

import com.supermarket.stockmanagement.dto.ProductSupplierDetailsDTO;
import com.supermarket.stockmanagement.model.ProductSupplier;
import com.supermarket.stockmanagement.service.ProductSupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-suppliers")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductSupplierController {

    @Autowired
    private ProductSupplierService productSupplierService;

    @GetMapping
    public ResponseEntity<List<ProductSupplier>> getAllProductSuppliers() {
        return ResponseEntity.ok(productSupplierService.getAllProductSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductSupplier> getProductSupplierById(@PathVariable String id) {
        ProductSupplier productSupplier = productSupplierService.getProductSupplierById(id);
        if (productSupplier != null) {
            return ResponseEntity.ok(productSupplier);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ProductSupplier>> getSuppliersByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(productSupplierService.getSuppliersByProductId(productId));
    }

    @GetMapping("/by-product/{productId}/details")
    public ResponseEntity<List<ProductSupplierDetailsDTO>> getSupplierDetailsForProduct(@PathVariable String productId) {
        return ResponseEntity.ok(productSupplierService.getSupplierDetailsForProduct(productId));
    }

    @GetMapping("/by-supplier/{supplierId}")
    public ResponseEntity<List<ProductSupplier>> getProductsBySupplierId(@PathVariable String supplierId) {
        return ResponseEntity.ok(productSupplierService.getProductsBySupplierId(supplierId));
    }

    @PostMapping
    public ResponseEntity<ProductSupplier> createProductSupplier(@RequestBody ProductSupplier productSupplier) {
        return ResponseEntity.ok(productSupplierService.createProductSupplier(productSupplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductSupplier> updateProductSupplier(
            @PathVariable String id,
            @RequestBody ProductSupplier productSupplier) {
        return ResponseEntity.ok(productSupplierService.updateProductSupplier(id, productSupplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductSupplier(@PathVariable String id) {
        productSupplierService.deleteProductSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
