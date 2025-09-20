package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.dto.ProductSupplierDetailsDTO;
import com.supermarket.stockmanagement.model.ProductSupplier;
import com.supermarket.stockmanagement.model.Supplier;
import com.supermarket.stockmanagement.repository.ProductSupplierRepository;
import com.supermarket.stockmanagement.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductSupplierService {

    @Autowired
    private ProductSupplierRepository productSupplierRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<ProductSupplier> getAllProductSuppliers() {
        return productSupplierRepository.findAll();
    }

    public ProductSupplier getProductSupplierById(String id) {
        return productSupplierRepository.findById(id).orElse(null);
    }

    public List<ProductSupplier> getSuppliersByProductId(String productId) {
        return productSupplierRepository.findByProductId(productId);
    }

    public List<ProductSupplier> getProductsBySupplierId(String supplierId) {
        return productSupplierRepository.findBySupplierId(supplierId);
    }

    public List<ProductSupplierDetailsDTO> getSupplierDetailsForProduct(String productId) {
        List<ProductSupplier> productSuppliers = productSupplierRepository.findByProductId(productId);
        List<ProductSupplierDetailsDTO> detailsList = new ArrayList<>();

        for (ProductSupplier ps : productSuppliers) {
            Supplier supplier = supplierRepository.findById(ps.getSupplierId()).orElse(null);
            if (supplier != null) {
                ProductSupplierDetailsDTO details = new ProductSupplierDetailsDTO();
                details.setProductSupplierId(ps.getId());
                details.setSupplierId(supplier.getId());
                details.setSupplierName(supplier.getName());
                details.setContactPerson(supplier.getContactPerson());
                details.setEmail(supplier.getEmail());
                details.setPhone(supplier.getPhone());
                details.setAddress(supplier.getAddress());
                details.setCostPerUnit(ps.getCostPerUnit());
                details.setDeliveryDays(ps.getDeliveryDays());
                details.setMinimumOrderQuantity(ps.getMinimumOrderQuantity());
                details.setIsPreferred(ps.getIsPreferred());
                details.setNotes(ps.getNotes());
                
                // Calculate total cost for minimum order
                if (ps.getCostPerUnit() != null && ps.getMinimumOrderQuantity() != null) {
                    details.setTotalCostForMinOrder(ps.getCostPerUnit() * ps.getMinimumOrderQuantity());
                }
                
                detailsList.add(details);
            }
        }

        // Sort by preferred suppliers first, then by cost
        detailsList.sort((a, b) -> {
            if (a.getIsPreferred() != null && b.getIsPreferred() != null) {
                if (a.getIsPreferred() && !b.getIsPreferred()) return -1;
                if (!a.getIsPreferred() && b.getIsPreferred()) return 1;
            }
            return Double.compare(a.getCostPerUnit(), b.getCostPerUnit());
        });

        return detailsList;
    }

    public ProductSupplier createProductSupplier(ProductSupplier productSupplier) {
        return productSupplierRepository.save(productSupplier);
    }

    public ProductSupplier updateProductSupplier(String id, ProductSupplier productSupplier) {
        productSupplier.setId(id);
        return productSupplierRepository.save(productSupplier);
    }

    public void deleteProductSupplier(String id) {
        productSupplierRepository.deleteById(id);
    }
}
