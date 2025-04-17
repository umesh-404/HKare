package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.MedicationRequest;
import com.hkare.hkare_backend.dto.MedicationResponse;
import com.hkare.hkare_backend.model.Medication;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicationService {
    /**
     * Create a new medication
     *
     * @param request Medication data
     * @return Created medication response
     */
    MedicationResponse createMedication(MedicationRequest request);
    
    /**
     * Update an existing medication
     *
     * @param medicationId Medication ID
     * @param request Updated medication data
     * @return Updated medication response
     */
    MedicationResponse updateMedication(Long medicationId, MedicationRequest request);
    
    /**
     * Get medication by ID
     *
     * @param medicationId Medication ID
     * @return Optional containing medication if found
     */
    Optional<MedicationResponse> getMedicationById(Long medicationId);
    
    /**
     * Delete medication by ID
     *
     * @param medicationId Medication ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deleteMedication(Long medicationId);
    
    /**
     * Get all medications
     *
     * @return List of all medications
     */
    List<MedicationResponse> getAllMedications();
    
    /**
     * Search medications by name or generic name
     *
     * @param keyword Search keyword
     * @return List of medications matching the search
     */
    List<MedicationResponse> searchMedications(String keyword);
    
    /**
     * Get medications by type
     *
     * @param type Medication type
     * @return List of medications of the specified type
     */
    List<MedicationResponse> getMedicationsByType(Medication.MedicationType type);
    
    /**
     * Get medications by dosage form
     *
     * @param dosageForm Dosage form
     * @return List of medications with the specified dosage form
     */
    List<MedicationResponse> getMedicationsByDosageForm(String dosageForm);
    
    /**
     * Get medications that require prescription
     *
     * @param requiresPrescription Whether medication requires prescription
     * @return List of medications based on prescription requirement
     */
    List<MedicationResponse> getMedicationsByPrescriptionRequirement(Boolean requiresPrescription);
    
    /**
     * Get medications by active status
     *
     * @param isActive Active status
     * @return List of medications based on active status
     */
    List<MedicationResponse> getMedicationsByActiveStatus(Boolean isActive);
    
    /**
     * Get expired medications
     *
     * @return List of expired medications
     */
    List<MedicationResponse> getExpiredMedications();
    
    /**
     * Get medications expiring between dates
     *
     * @param startDate Start date
     * @param endDate End date
     * @return List of medications expiring between the dates
     */
    List<MedicationResponse> getMedicationsExpiringBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get medications that need to be reordered
     *
     * @return List of medications to reorder
     */
    List<MedicationResponse> getMedicationsToReorder();
    
    /**
     * Get out of stock medications
     *
     * @return List of out of stock medications
     */
    List<MedicationResponse> getOutOfStockMedications();
    
    /**
     * Update medication stock
     *
     * @param medicationId Medication ID
     * @param quantity Quantity to add (positive) or subtract (negative)
     * @return Updated medication response
     */
    MedicationResponse updateMedicationStock(Long medicationId, Integer quantity);
    
    /**
     * Check if medication is available in sufficient quantity
     *
     * @param medicationId Medication ID
     * @param requiredQuantity Required quantity
     * @return true if available, false otherwise
     */
    boolean isMedicationAvailable(Long medicationId, Integer requiredQuantity);
} 