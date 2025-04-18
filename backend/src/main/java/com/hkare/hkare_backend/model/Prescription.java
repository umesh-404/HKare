package com.hkare.hkare_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;
    
    private LocalDate prescriptionDate;
    private LocalDate expiryDate;
    
    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private Boolean isRefillable;
    private Integer refillsRemaining;
    private Integer totalRefills;
    
    @ElementCollection
    @CollectionTable(
        name = "prescription_medications",
        joinColumns = @JoinColumn(name = "prescription_id")
    )
    private List<PrescriptionMedication> medications = new ArrayList<>();
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "pharmacy_id")
    private Pharmacy pharmacy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (prescriptionDate == null) {
            prescriptionDate = LocalDate.now();
        }
        
        if (status == null) {
            status = PrescriptionStatus.ACTIVE;
        }
        
        if (isRefillable == null) {
            isRefillable = false;
        }
        
        if (isRefillable && refillsRemaining == null) {
            refillsRemaining = totalRefills != null ? totalRefills : 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PrescriptionStatus {
        ACTIVE, COMPLETED, EXPIRED, CANCELLED
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionMedication {
        private String medicationName;
        private String dosage;
        private String frequency;
        private String instructions;
        private Integer quantity;
        private String duration;
    }
} 