package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Prescription;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long prescriptionId;
    
    // Patient info
    private String patientId;
    private String patientName;
    
    // Doctor info
    private String doctorId;
    private String doctorName;
    
    // Medical Record info
    private Long medicalRecordId;
    
    // Prescription details
    private LocalDate prescriptionDate;
    private LocalDate expiryDate;
    private Prescription.PrescriptionStatus status;
    private String notes;
    private Boolean isRefillable;
    private Integer refillsRemaining;
    private Integer totalRefills;
    
    @Builder.Default
    private List<MedicationItem> medications = new ArrayList<>();
    
    // Pharmacy info
    private Long pharmacyId;
    private String pharmacyName;
    private String pharmacyAddress;
    private String pharmacyPhone;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicationItem {
        private String medicationName;
        private String dosage;
        private String frequency;
        private String instructions;
        private Integer quantity;
        private String duration;
    }
} 