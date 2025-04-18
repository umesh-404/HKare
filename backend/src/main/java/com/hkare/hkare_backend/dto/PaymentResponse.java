package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long paymentId;
    
    // Patient info
    private String patientId;
    private String patientName;
    
    // Appointment info
    private Long appointmentId;
    private LocalDateTime appointmentDateTime;
    private String doctorName;
    
    // Payment details
    private Double amount;
    private Payment.PaymentType type;
    private Payment.PaymentStatus status;
    private String transactionId;
    private String paymentMethod;
    private String notes;
    private LocalDateTime paymentDate;
    
    // Staff info
    private String staffId;
    private String staffName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 