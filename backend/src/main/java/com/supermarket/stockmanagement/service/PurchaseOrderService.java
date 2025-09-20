package com.supermarket.stockmanagement.service;

import com.supermarket.stockmanagement.model.PurchaseOrder;
import com.supermarket.stockmanagement.model.Product;
import com.supermarket.stockmanagement.model.Supplier;
import com.supermarket.stockmanagement.model.Transaction;
import com.supermarket.stockmanagement.repository.PurchaseOrderRepository;
import com.supermarket.stockmanagement.repository.ProductRepository;
import com.supermarket.stockmanagement.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private TransactionService transactionService;

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(String id) {
        return purchaseOrderRepository.findById(id).orElse(null);
    }

    public List<PurchaseOrder> getPurchaseOrdersByStatus(PurchaseOrder.OrderStatus status) {
        return purchaseOrderRepository.findByStatus(status);
    }

    public List<PurchaseOrder> getPurchaseOrdersBySupplierId(String supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId);
    }

    public List<PurchaseOrder> getPurchaseOrdersByProductId(String productId) {
        return purchaseOrderRepository.findByProductId(productId);
    }

    public List<PurchaseOrder> getUpcomingDeliveries() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekLater = now.plusDays(7);
        return purchaseOrderRepository.findByExpectedDeliveryDateBetween(now, weekLater);
    }

    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {
        // Generate order number
        String orderNumber = generateOrderNumber();
        purchaseOrder.setOrderNumber(orderNumber);
        
        // Set order date
        purchaseOrder.setOrderDate(LocalDateTime.now());
        
        // Fetch product and supplier details
        Product product = productRepository.findById(purchaseOrder.getProductId()).orElse(null);
        Supplier supplier = supplierRepository.findById(purchaseOrder.getSupplierId()).orElse(null);
        
        if (product != null) {
            purchaseOrder.setProductName(product.getName());
        }
        
        if (supplier != null) {
            purchaseOrder.setSupplierName(supplier.getName());
        }
        
        // Calculate total amount
        if (purchaseOrder.getQuantity() != null && purchaseOrder.getUnitPrice() != null) {
            purchaseOrder.setTotalAmount(purchaseOrder.getQuantity() * purchaseOrder.getUnitPrice());
        }
        
        // Set default status
        if (purchaseOrder.getStatus() == null) {
            purchaseOrder.setStatus(PurchaseOrder.OrderStatus.PENDING);
        }
        
        if (purchaseOrder.getPaymentStatus() == null) {
            purchaseOrder.setPaymentStatus(PurchaseOrder.PaymentStatus.PENDING);
        }
        
        return purchaseOrderRepository.save(purchaseOrder);
    }

    public PurchaseOrder updatePurchaseOrder(String id, PurchaseOrder purchaseOrder) {
        PurchaseOrder existingOrder = purchaseOrderRepository.findById(id).orElse(null);
        if (existingOrder != null) {
            purchaseOrder.setId(id);
            purchaseOrder.setOrderNumber(existingOrder.getOrderNumber());
            purchaseOrder.setOrderDate(existingOrder.getOrderDate());
            
            // If status changes to DELIVERED, create a purchase transaction
            if (existingOrder.getStatus() != PurchaseOrder.OrderStatus.DELIVERED 
                && purchaseOrder.getStatus() == PurchaseOrder.OrderStatus.DELIVERED) {
                createPurchaseTransaction(purchaseOrder);
            }
            
            return purchaseOrderRepository.save(purchaseOrder);
        }
        return null;
    }

    public void deletePurchaseOrder(String id) {
        purchaseOrderRepository.deleteById(id);
    }

    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Count orders for today
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        long count = purchaseOrderRepository.countByOrderDateBetween(startOfDay, endOfDay);
        
        return String.format("PO-%s-%03d", dateStr, count + 1);
    }

    private void createPurchaseTransaction(PurchaseOrder order) {
        Transaction transaction = new Transaction();
        transaction.setProductId(order.getProductId());
        transaction.setType(Transaction.TransactionType.PURCHASE);
        transaction.setQuantity(order.getQuantity());
        transaction.setUnitPrice(order.getUnitPrice());
        transaction.setTotalAmount(order.getTotalAmount());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setNotes("Purchase Order: " + order.getOrderNumber());
        
        transactionService.createTransaction(transaction);
    }

    public List<PurchaseOrder> getPendingPayments() {
        return purchaseOrderRepository.findByPaymentStatus(PurchaseOrder.PaymentStatus.PENDING);
    }

    public PurchaseOrder updatePaymentStatus(String id, PurchaseOrder.PaymentStatus status, String paymentMethod) {
        PurchaseOrder order = purchaseOrderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setPaymentStatus(status);
            order.setPaymentMethod(paymentMethod);
            if (status == PurchaseOrder.PaymentStatus.PAID) {
                order.setPaymentDate(LocalDateTime.now());
            }
            return purchaseOrderRepository.save(order);
        }
        return null;
    }
}
