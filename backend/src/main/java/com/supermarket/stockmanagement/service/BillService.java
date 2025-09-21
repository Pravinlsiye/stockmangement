package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.dto.BillDTO;
import com.supermarket.stockmanagement.dto.BillItemDTO;
import com.supermarket.stockmanagement.model.Product;
import com.supermarket.stockmanagement.model.Transaction;
import com.supermarket.stockmanagement.repository.ProductRepository;
import com.supermarket.stockmanagement.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<BillDTO> getAllBills() {
        // Get all SALE transactions with billId
        List<Transaction> salesWithBillId = transactionRepository.findAll()
            .stream()
            .filter(t -> t.getType() == Transaction.TransactionType.SALE && t.getBillId() != null)
            .collect(Collectors.toList());
        
        // Group by billId
        Map<String, List<Transaction>> billGroups = salesWithBillId.stream()
            .collect(Collectors.groupingBy(Transaction::getBillId));
        
        // Convert to BillDTO list
        List<BillDTO> bills = new ArrayList<>();
        for (Map.Entry<String, List<Transaction>> entry : billGroups.entrySet()) {
            BillDTO bill = new BillDTO();
            bill.setBillId(entry.getKey());
            
            List<Transaction> transactions = entry.getValue();
            if (!transactions.isEmpty()) {
                bill.setBillDate(transactions.get(0).getTransactionDate());
                bill.setTotalItems(transactions.stream().mapToInt(Transaction::getQuantity).sum());
                bill.setTotalAmount(transactions.stream().mapToDouble(Transaction::getTotalAmount).sum());
            }
            
            bills.add(bill);
        }
        
        // Sort by date descending
        bills.sort((b1, b2) -> b2.getBillDate().compareTo(b1.getBillDate()));
        
        return bills;
    }
    
    public BillDTO getBillDetails(String billId) {
        List<Transaction> transactions = transactionRepository.findAll()
            .stream()
            .filter(t -> billId.equals(t.getBillId()))
            .collect(Collectors.toList());
        
        if (transactions.isEmpty()) {
            return null;
        }
        
        BillDTO bill = new BillDTO();
        bill.setBillId(billId);
        bill.setBillDate(transactions.get(0).getTransactionDate());
        bill.setTotalItems(transactions.stream().mapToInt(Transaction::getQuantity).sum());
        bill.setTotalAmount(transactions.stream().mapToDouble(Transaction::getTotalAmount).sum());
        
        // Get product details
        List<String> productIds = transactions.stream()
            .map(Transaction::getProductId)
            .distinct()
            .collect(Collectors.toList());
        
        Map<String, Product> productMap = productRepository.findAllById(productIds)
            .stream()
            .collect(Collectors.toMap(Product::getId, p -> p));
        
        // Create bill items
        List<BillItemDTO> items = transactions.stream()
            .map(t -> {
                BillItemDTO item = new BillItemDTO();
                item.setProductId(t.getProductId());
                item.setQuantity(t.getQuantity());
                item.setUnitPrice(t.getUnitPrice());
                item.setTotalPrice(t.getTotalAmount());
                
                Product product = productMap.get(t.getProductId());
                if (product != null) {
                    item.setProductName(product.getName());
                    item.setProductCode(product.getBarcode());
                }
                
                return item;
            })
            .collect(Collectors.toList());
        
        bill.setItems(items);
        
        return bill;
    }
    
    public String generateBillId() {
        // Generate bill ID in format: BILL-YYYYMMDD-XXXXX
        String datePart = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        String randomPart = String.format("%05d", new Random().nextInt(100000));
        return "BILL-" + datePart + "-" + randomPart;
    }
}
