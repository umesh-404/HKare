package com.hkare.hkare_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicationId;
    
    private String name;
    private String genericName;
    private String brand;
    private String manufacturer;
    
    @Enumerated(EnumType.STRING)
    private MedicationType type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String dosageForm; // e.g., tablet, capsule, liquid
    private String strength; // e.g., 500mg, 10ml
    
    @Enumerated(EnumType.STRING)
    private DosageUnit dosageUnit;
    
    @Column(columnDefinition = "TEXT")
    private String sideEffects;
    
    @Column(columnDefinition = "TEXT")
    private String contraindications;
    
    @Column(columnDefinition = "TEXT")
    private String storage;
    
    private Boolean requiresPrescription;
    private BigDecimal price;
    
    private Integer stockQuantity;
    private Integer reorderLevel;
    
    private String batchNumber;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    
    private String barcode;
    private String NDCCode; // National Drug Code
    
    private Boolean isActive;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        if (isActive == null) {
            isActive = true;
        }
        
        if (requiresPrescription == null) {
            requiresPrescription = true;
        }
        
        if (stockQuantity == null) {
            stockQuantity = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum MedicationType {
        ANTIBIOTIC, ANALGESIC, ANTI_INFLAMMATORY, ANTIHISTAMINE, ANTIDEPRESSANT,
        ANTIHYPERTENSIVE, ANTIDIABETIC, DIURETIC, STEROID, VACCINE, VITAMIN,
        ANTICONVULSANT, ANTIPSYCHOTIC, ANTICOAGULANT, BRONCHODILATOR, SEDATIVE,
        LAXATIVE, ANTACID, ANTIVIRAL, ANTIFUNGAL, OTHER
    }
    
    public enum DosageUnit {
        MG, ML, G, MCG, PERCENT, IU, MEQ, UNIT, OTHER
    }
} 