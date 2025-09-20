package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.model.Supplier;
import com.supermarket.stockmanagement.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    public Optional<Supplier> getSupplierById(String id) {
        return supplierRepository.findById(id);
    }
    
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }
    
    public Supplier updateSupplier(String id, Supplier supplier) {
        supplier.setId(id);
        return supplierRepository.save(supplier);
    }
    
    public void deleteSupplier(String id) {
        supplierRepository.deleteById(id);
    }
}
