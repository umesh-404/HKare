package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.PaymentRequest;
import com.hkare.hkare_backend.dto.PaymentResponse;
import com.hkare.hkare_backend.model.Payment;
import com.hkare.hkare_backend.service.PaymentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/payments", "/api/payments"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;
    
    @PostConstruct
    public void init() {
        System.out.println("PaymentController initialized with mappings: /payments and /api/payments");
    }
    
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentRequest request) {
        System.out.println("POST request to create payment for patient: " + request.getPatientId());
        try {
            PaymentResponse response = paymentService.createPayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("Error creating payment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long paymentId) {
        System.out.println("GET request for payment ID: " + paymentId);
        return paymentService.getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long paymentId,
            @RequestBody PaymentRequest request) {
        System.out.println("PUT request to update payment ID: " + paymentId);
        try {
            PaymentResponse response = paymentService.updatePayment(paymentId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating payment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long paymentId) {
        System.out.println("DELETE request for payment ID: " + paymentId);
        boolean deleted = paymentService.deletePayment(paymentId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        System.out.println("GET request for all payments");
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByPatient(@PathVariable String patientId) {
        System.out.println("GET request for payments of patient ID: " + patientId);
        return ResponseEntity.ok(paymentService.getPaymentsByPatient(patientId));
    }
    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByAppointment(@PathVariable Long appointmentId) {
        System.out.println("GET request for payments of appointment ID: " + appointmentId);
        return ResponseEntity.ok(paymentService.getPaymentsByAppointment(appointmentId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(
            @PathVariable Payment.PaymentStatus status) {
        System.out.println("GET request for payments with status: " + status);
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByType(
            @PathVariable Payment.PaymentType type) {
        System.out.println("GET request for payments with type: " + type);
        return ResponseEntity.ok(paymentService.getPaymentsByType(type));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentResponse>> getPaymentsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        System.out.println("GET request for payments between: " + startDate + " and " + endDate);
        return ResponseEntity.ok(paymentService.getPaymentsBetweenDates(startDate, endDate));
    }
    
    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> statusUpdate) {
        System.out.println("PATCH request to update status of payment ID: " + paymentId);
        try {
            Payment.PaymentStatus newStatus = Payment.PaymentStatus.valueOf(statusUpdate.get("status"));
            PaymentResponse response = paymentService.updatePaymentStatus(paymentId, newStatus);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid status provided: " + statusUpdate.get("status"));
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Error updating payment status: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/revenue/period")
    public ResponseEntity<Map<String, Double>> getTotalRevenueForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        System.out.println("GET request for total revenue between: " + startDate + " and " + endDate);
        Double totalRevenue = paymentService.getTotalRevenueForPeriod(startDate, endDate);
        Map<String, Double> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/revenue/monthly/{year}")
    public ResponseEntity<Map<Integer, Double>> getMonthlyRevenueForYear(@PathVariable int year) {
        System.out.println("GET request for monthly revenue for year: " + year);
        Map<Integer, Double> monthlyRevenue = paymentService.getMonthlyRevenueForYear(year);
        return ResponseEntity.ok(monthlyRevenue);
    }
    
    @GetMapping("/revenue/monthly/{year}/{month}")
    public ResponseEntity<Map<String, Double>> getTotalRevenueForMonth(
            @PathVariable int year,
            @PathVariable int month) {
        System.out.println("GET request for total revenue for month: " + month + "/" + year);
        
        // Validate month range
        if (month < 1 || month > 12) {
            return ResponseEntity.badRequest().build();
        }
        
        Double totalRevenue = paymentService.getTotalRevenueForMonth(year, month);
        Map<String, Double> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Map<String, Long>> countPaymentsByStatus(
            @PathVariable Payment.PaymentStatus status) {
        System.out.println("GET request for count of payments with status: " + status);
        long count = paymentService.countPaymentsByStatus(status);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getPaymentDashboardSummary() {
        System.out.println("GET request for payment dashboard summary");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = YearMonth.now().atEndOfMonth().atTime(23, 59, 59);
        LocalDateTime startOfYear = Year.now().atDay(1).atStartOfDay();
        LocalDateTime endOfYear = Year.now().atDay(365).atTime(23, 59, 59);
        
        Double monthlyRevenue = paymentService.getTotalRevenueForPeriod(startOfMonth, endOfMonth);
        Double yearlyRevenue = paymentService.getTotalRevenueForPeriod(startOfYear, endOfYear);
        
        long pendingPayments = paymentService.countPaymentsByStatus(Payment.PaymentStatus.PENDING);
        long completedPayments = paymentService.countPaymentsByStatus(Payment.PaymentStatus.COMPLETED);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("monthlyRevenue", monthlyRevenue);
        summary.put("yearlyRevenue", yearlyRevenue);
        summary.put("pendingPayments", pendingPayments);
        summary.put("completedPayments", completedPayments);
        summary.put("monthlyRevenueByMonth", paymentService.getMonthlyRevenueForYear(now.getYear()));
        
        return ResponseEntity.ok(summary);
    }
} 