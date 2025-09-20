package com.supermarket.stockmanagement.repository;

import com.supermarket.stockmanagement.model.PurchaseOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends MongoRepository<PurchaseOrder, String> {
    List<PurchaseOrder> findByStatus(PurchaseOrder.OrderStatus status);
    List<PurchaseOrder> findBySupplierId(String supplierId);
    List<PurchaseOrder> findByProductId(String productId);
    List<PurchaseOrder> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    List<PurchaseOrder> findByExpectedDeliveryDateBetween(LocalDateTime start, LocalDateTime end);
    List<PurchaseOrder> findByPaymentStatus(PurchaseOrder.PaymentStatus paymentStatus);
    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
