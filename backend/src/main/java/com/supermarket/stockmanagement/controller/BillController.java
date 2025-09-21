package com.supermarket.stockmanagement.controller;

import com.supermarket.stockmanagement.dto.BillDTO;
import com.supermarket.stockmanagement.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:4200")
public class BillController {
    
    @Autowired
    private BillService billService;
    
    @GetMapping
    public ResponseEntity<List<BillDTO>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }
    
    @GetMapping("/{billId}")
    public ResponseEntity<BillDTO> getBillDetails(@PathVariable String billId) {
        BillDTO bill = billService.getBillDetails(billId);
        if (bill != null) {
            return ResponseEntity.ok(bill);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/generate-id")
    public ResponseEntity<String> generateBillId() {
        return ResponseEntity.ok(billService.generateBillId());
    }
}
