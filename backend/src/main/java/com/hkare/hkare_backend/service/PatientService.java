package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.PatientDetailsRequest;
import com.hkare.hkare_backend.dto.PatientResponse;
import com.hkare.hkare_backend.model.Patient;

import java.util.List;

public interface PatientService {
    /**
     * Get all patients
     * @return List of all patients
     */
    List<PatientResponse> getAllPatients();
    
    /**
     * Get a patient by ID
     * @param patientId ID of the patient
     * @return Patient data
     */
    PatientResponse getPatientById(String patientId);
    
    /**
     * Create a new patient
     * @param request Patient details
     * @return Created patient data
     */
    PatientResponse createPatient(PatientDetailsRequest request);
    
    /**
     * Update a patient
     * @param patientId ID of the patient
     * @param request Updated patient details
     * @return Updated patient data
     */
    PatientResponse updatePatient(String patientId, PatientDetailsRequest request);
    
    /**
     * Delete a patient
     * @param patientId ID of the patient
     */
    void deletePatient(String patientId);
    
    /**
     * Search patients by name
     * @param query Search query
     * @return List of matching patients
     */
    List<PatientResponse> searchPatients(String query);
} 