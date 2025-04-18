package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Medication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequest {
    private String name;
    private String genericName;
    private String brand;
    private String manufacturer;
    private Medication.MedicationType type;
    private String description;
    private String dosageForm;
    private String strength;
    private Medication.DosageUnit dosageUnit;
    private String sideEffects;
    private String contraindications;
    private String storage;
    private Boolean requiresPrescription;
    private BigDecimal price;
    private Integer stockQuantity;
    private Integer reorderLevel;
    private String batchNumber;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private String barcode;
    private String NDCCode;
    private Boolean isActive;
} 