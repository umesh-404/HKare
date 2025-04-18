package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.MedicalRecordRequest;
import com.hkare.hkare_backend.dto.MedicalRecordResponse;
import com.hkare.hkare_backend.model.MedicalRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MedicalRecordService {
    /**
     * Create a new medical record
     *
     * @param request Medical record data
     * @return Created medical record response
     */
    MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request);
    
    /**
     * Update an existing medical record
     *
     * @param recordId Medical record ID
     * @param request Updated medical record data
     * @return Updated medical record response
     */
    MedicalRecordResponse updateMedicalRecord(Long recordId, MedicalRecordRequest request);
    
    /**
     * Get medical record by ID
     *
     * @param recordId Medical record ID
     * @return Optional containing medical record if found
     */
    Optional<MedicalRecordResponse> getMedicalRecordById(Long recordId);
    
    /**
     * Delete medical record by ID
     *
     * @param recordId Medical record ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deleteMedicalRecord(Long recordId);
    
    /**
     * Get all medical records
     *
     * @return List of all medical records
     */
    List<MedicalRecordResponse> getAllMedicalRecords();
    
    /**
     * Get medical records for a specific patient
     *
     * @param patientId Patient ID
     * @return List of medical records for the patient
     */
    List<MedicalRecordResponse> getMedicalRecordsByPatient(String patientId);
    
    /**
     * Get medical records for a specific doctor
     *
     * @param doctorId Doctor ID
     * @return List of medical records for the doctor
     */
    List<MedicalRecordResponse> getMedicalRecordsByDoctor(String doctorId);
    
    /**
     * Get medical records for a specific appointment
     *
     * @param appointmentId Appointment ID
     * @return List of medical records for the appointment
     */
    List<MedicalRecordResponse> getMedicalRecordsByAppointment(Long appointmentId);
    
    /**
     * Get medical records by type
     *
     * @param recordType Record type
     * @return List of medical records with the specified type
     */
    List<MedicalRecordResponse> getMedicalRecordsByType(MedicalRecord.RecordType recordType);
    
    /**
     * Get medical records between two dates
     *
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of medical records between the dates
     */
    List<MedicalRecordResponse> getMedicalRecordsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get patient's medical records by type
     *
     * @param patientId Patient ID
     * @param recordType Record type
     * @return List of patient's medical records with the specified type
     */
    List<MedicalRecordResponse> getPatientMedicalRecordsByType(String patientId, MedicalRecord.RecordType recordType);
    
    /**
     * Get all diagnoses for a patient
     *
     * @param patientId Patient ID
     * @return List of unique diagnoses for the patient
     */
    List<String> getPatientDiagnoses(String patientId);
    
    /**
     * Get count of patient's records by type
     *
     * @param patientId Patient ID
     * @return Map with record type as key and count as value
     */
    Map<MedicalRecord.RecordType, Long> countPatientRecordsByType(String patientId);
} 