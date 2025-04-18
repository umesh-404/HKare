package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String patientId;
    private Long appointmentId;
    private Double amount;
    private Payment.PaymentType type;
    private Payment.PaymentStatus status;
    private String transactionId;
    private String paymentMethod;
    private String notes;
    private LocalDateTime paymentDate;
    private String staffId; // ID of staff member who received the payment
} 