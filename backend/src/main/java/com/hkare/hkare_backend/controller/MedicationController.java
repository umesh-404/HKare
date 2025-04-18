package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.MedicationRequest;
import com.hkare.hkare_backend.dto.MedicationResponse;
import com.hkare.hkare_backend.model.Medication;
import com.hkare.hkare_backend.service.MedicationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/medications", "/api/medications"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicationController {
    private final MedicationService medicationService;
    
    @PostMapping
    public ResponseEntity<MedicationResponse> createMedication(@Valid @RequestBody MedicationRequest request) {
        MedicationResponse response = medicationService.createMedication(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{medicationId}")
    public ResponseEntity<MedicationResponse> updateMedication(
            @PathVariable Long medicationId,
            @Valid @RequestBody MedicationRequest request) {
        try {
            MedicationResponse response = medicationService.updateMedication(medicationId, request);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{medicationId}")
    public ResponseEntity<MedicationResponse> getMedicationById(@PathVariable Long medicationId) {
        return medicationService.getMedicationById(medicationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{medicationId}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long medicationId) {
        boolean deleted = medicationService.deleteMedication(medicationId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<MedicationResponse>> getAllMedications() {
        List<MedicationResponse> medications = medicationService.getAllMedications();
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MedicationResponse>> searchMedications(@RequestParam String keyword) {
        List<MedicationResponse> medications = medicationService.searchMedications(keyword);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<MedicationResponse>> getMedicationsByType(
            @PathVariable Medication.MedicationType type) {
        List<MedicationResponse> medications = medicationService.getMedicationsByType(type);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/dosage-form/{dosageForm}")
    public ResponseEntity<List<MedicationResponse>> getMedicationsByDosageForm(@PathVariable String dosageForm) {
        List<MedicationResponse> medications = medicationService.getMedicationsByDosageForm(dosageForm);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/prescription-required/{requiresPrescription}")
    public ResponseEntity<List<MedicationResponse>> getMedicationsByPrescriptionRequirement(
            @PathVariable Boolean requiresPrescription) {
        List<MedicationResponse> medications = medicationService.getMedicationsByPrescriptionRequirement(requiresPrescription);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/active/{isActive}")
    public ResponseEntity<List<MedicationResponse>> getMedicationsByActiveStatus(@PathVariable Boolean isActive) {
        List<MedicationResponse> medications = medicationService.getMedicationsByActiveStatus(isActive);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<MedicationResponse>> getExpiredMedications() {
        List<MedicationResponse> medications = medicationService.getExpiredMedications();
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/expiring")
    public ResponseEntity<List<MedicationResponse>> getMedicationsExpiringBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MedicationResponse> medications = medicationService.getMedicationsExpiringBetween(startDate, endDate);
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/to-reorder")
    public ResponseEntity<List<MedicationResponse>> getMedicationsToReorder() {
        List<MedicationResponse> medications = medicationService.getMedicationsToReorder();
        return ResponseEntity.ok(medications);
    }
    
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<MedicationResponse>> getOutOfStockMedications() {
        List<MedicationResponse> medications = medicationService.getOutOfStockMedications();
        return ResponseEntity.ok(medications);
    }
    
    @PutMapping("/{medicationId}/stock")
    public ResponseEntity<?> updateMedicationStock(
            @PathVariable Long medicationId,
            @RequestParam Integer quantity) {
        try {
            MedicationResponse response = medicationService.updateMedicationStock(medicationId, quantity);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{medicationId}/available")
    public ResponseEntity<Boolean> isMedicationAvailable(
            @PathVariable Long medicationId,
            @RequestParam Integer requiredQuantity) {
        try {
            boolean isAvailable = medicationService.isMedicationAvailable(medicationId, requiredQuantity);
            return ResponseEntity.ok(isAvailable);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 