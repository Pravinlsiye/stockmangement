package com.supermarket.stockmanagement.controller;

import com.supermarket.stockmanagement.model.PurchaseOrder;
import com.supermarket.stockmanagement.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:4200")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(@PathVariable String id) {
        PurchaseOrder order = purchaseOrderService.getPurchaseOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersByStatus(@PathVariable String status) {
        try {
            PurchaseOrder.OrderStatus orderStatus = PurchaseOrder.OrderStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByStatus(orderStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersBySupplierId(@PathVariable String supplierId) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersBySupplierId(supplierId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByProductId(productId));
    }

    @GetMapping("/upcoming-deliveries")
    public ResponseEntity<List<PurchaseOrder>> getUpcomingDeliveries() {
        return ResponseEntity.ok(purchaseOrderService.getUpcomingDeliveries());
    }

    @GetMapping("/pending-payments")
    public ResponseEntity<List<PurchaseOrder>> getPendingPayments() {
        return ResponseEntity.ok(purchaseOrderService.getPendingPayments());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        return ResponseEntity.ok(purchaseOrderService.createPurchaseOrder(purchaseOrder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(
            @PathVariable String id,
            @RequestBody PurchaseOrder purchaseOrder) {
        PurchaseOrder updated = purchaseOrderService.updatePurchaseOrder(id, purchaseOrder);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<PurchaseOrder> updatePaymentStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> paymentData) {
        String status = paymentData.get("status");
        String paymentMethod = paymentData.get("paymentMethod");
        
        try {
            PurchaseOrder.PaymentStatus paymentStatus = PurchaseOrder.PaymentStatus.valueOf(status.toUpperCase());
            PurchaseOrder updated = purchaseOrderService.updatePaymentStatus(id, paymentStatus, paymentMethod);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable String id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }
}
