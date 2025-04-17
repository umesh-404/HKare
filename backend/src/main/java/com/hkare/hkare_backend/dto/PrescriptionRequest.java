package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Prescription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {
    private String patientId;
    private String doctorId;
    private Long medicalRecordId;
    private LocalDate prescriptionDate;
    private LocalDate expiryDate;
    private Prescription.PrescriptionStatus status;
    private String notes;
    private Boolean isRefillable;
    private Integer totalRefills;
    private List<MedicationItem> medications = new ArrayList<>();
    private Long pharmacyId;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationItem {
        private String medicationName;
        private String dosage;
        private String frequency;
        private String instructions;
        private Integer quantity;
        private String duration;
    }
} 