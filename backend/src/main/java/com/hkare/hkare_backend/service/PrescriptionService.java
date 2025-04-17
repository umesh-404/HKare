package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.PrescriptionRequest;
import com.hkare.hkare_backend.dto.PrescriptionResponse;
import com.hkare.hkare_backend.model.Prescription;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PrescriptionService {
    /**
     * Create a new prescription
     *
     * @param request Prescription data
     * @return Created prescription response
     */
    PrescriptionResponse createPrescription(PrescriptionRequest request);
    
    /**
     * Update an existing prescription
     *
     * @param prescriptionId Prescription ID
     * @param request Updated prescription data
     * @return Updated prescription response
     */
    PrescriptionResponse updatePrescription(Long prescriptionId, PrescriptionRequest request);
    
    /**
     * Get prescription by ID
     *
     * @param prescriptionId Prescription ID
     * @return Optional containing prescription if found
     */
    Optional<PrescriptionResponse> getPrescriptionById(Long prescriptionId);
    
    /**
     * Delete prescription by ID
     *
     * @param prescriptionId Prescription ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deletePrescription(Long prescriptionId);
    
    /**
     * Get all prescriptions
     *
     * @return List of all prescriptions
     */
    List<PrescriptionResponse> getAllPrescriptions();
    
    /**
     * Get prescriptions for a specific patient
     *
     * @param patientId Patient ID
     * @return List of prescriptions for the patient
     */
    List<PrescriptionResponse> getPrescriptionsByPatient(String patientId);
    
    /**
     * Get prescriptions for a specific doctor
     *
     * @param doctorId Doctor ID
     * @return List of prescriptions for the doctor
     */
    List<PrescriptionResponse> getPrescriptionsByDoctor(String doctorId);
    
    /**
     * Get prescriptions for a specific pharmacy
     *
     * @param pharmacyId Pharmacy ID
     * @return List of prescriptions for the pharmacy
     */
    List<PrescriptionResponse> getPrescriptionsByPharmacy(Long pharmacyId);
    
    /**
     * Get prescriptions by status
     *
     * @param status Prescription status
     * @return List of prescriptions with the specified status
     */
    List<PrescriptionResponse> getPrescriptionsByStatus(Prescription.PrescriptionStatus status);
    
    /**
     * Get prescriptions between two dates
     *
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of prescriptions between the dates
     */
    List<PrescriptionResponse> getPrescriptionsBetweenDates(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get patient's prescriptions by status
     *
     * @param patientId Patient ID
     * @param status Prescription status
     * @return List of patient's prescriptions with the specified status
     */
    List<PrescriptionResponse> getPatientPrescriptionsByStatus(String patientId, Prescription.PrescriptionStatus status);
    
    /**
     * Get doctor's prescriptions by status
     *
     * @param doctorId Doctor ID
     * @param status Prescription status
     * @return List of doctor's prescriptions with the specified status
     */
    List<PrescriptionResponse> getDoctorPrescriptionsByStatus(String doctorId, Prescription.PrescriptionStatus status);
    
    /**
     * Update prescription status
     *
     * @param prescriptionId Prescription ID
     * @param status New status
     * @return Updated prescription response
     */
    PrescriptionResponse updatePrescriptionStatus(Long prescriptionId, Prescription.PrescriptionStatus status);
    
    /**
     * Process a refill for a prescription
     *
     * @param prescriptionId Prescription ID
     * @return Updated prescription response
     */
    PrescriptionResponse processPrescriptionRefill(Long prescriptionId);
    
    /**
     * Find expired prescriptions
     *
     * @return List of expired prescriptions
     */
    List<PrescriptionResponse> findExpiredPrescriptions();
    
    /**
     * Count doctor's prescriptions by date
     *
     * @param doctorId Doctor ID
     * @param date Date
     * @return Number of prescriptions for the doctor on the date
     */
    long countDoctorPrescriptionsByDate(String doctorId, LocalDate date);
    
    /**
     * Count patient's prescriptions in period
     *
     * @param patientId Patient ID
     * @param startDate Start date
     * @param endDate End date
     * @return Number of prescriptions for the patient in the period
     */
    long countPatientPrescriptionsInPeriod(String patientId, LocalDate startDate, LocalDate endDate);
} 