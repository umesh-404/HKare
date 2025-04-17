package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.PatientDetailsRequest;
import com.hkare.hkare_backend.dto.PatientResponse;
import com.hkare.hkare_backend.service.PatientService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PatientController {

    private final PatientService patientService;
    
    @PostConstruct
    public void init() {
        log.info("PatientController initialized with mapping: /api/patients");
    }

    /**
     * Test endpoint to verify controller is working
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        log.info("Test endpoint called");
        return ResponseEntity.ok("Patient API is working correctly");
    }

    /**
     * Get all patients
     * @return List of all patients
     */
    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        log.info("Received request to get all patients");
        try {
            List<PatientResponse> patients = patientService.getAllPatients();
            log.info("Returning {} patients", patients.size());
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            log.error("Error getting all patients", e);
            throw e;
        }
    }

    /**
     * Get a patient by ID
     * @param patientId ID of the patient
     * @return Patient data
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable String patientId) {
        log.info("Received request to get patient with ID: {}", patientId);
        PatientResponse patient = patientService.getPatientById(patientId);
        log.info("Returning patient with ID: {}", patient.getPatientId());
        return ResponseEntity.ok(patient);
    }

    /**
     * Create a new patient
     * @param request Patient details
     * @return Created patient data
     */
    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(@RequestBody PatientDetailsRequest request) {
        log.info("Received request to create a new patient");
        PatientResponse created = patientService.createPatient(request);
        log.info("Created patient with ID: {}", created.getPatientId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Update a patient
     * @param patientId ID of the patient
     * @param request Updated patient details
     * @return Updated patient data
     */
    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable String patientId,
            @RequestBody PatientDetailsRequest request) {
        log.info("Received request to update patient with ID: {}", patientId);
        PatientResponse updated = patientService.updatePatient(patientId, request);
        log.info("Updated patient with ID: {}", updated.getPatientId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a patient
     * @param patientId ID of the patient
     * @return No content response
     */
    @DeleteMapping("/{patientId}")
    public ResponseEntity<Void> deletePatient(@PathVariable String patientId) {
        log.info("Received request to delete patient with ID: {}", patientId);
        patientService.deletePatient(patientId);
        log.info("Deleted patient with ID: {}", patientId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search patients by name
     * @param query Search query
     * @return List of matching patients
     */
    @GetMapping("/search")
    public ResponseEntity<List<PatientResponse>> searchPatients(@RequestParam String query) {
        log.info("Received request to search patients with query: {}", query);
        List<PatientResponse> patients = patientService.searchPatients(query);
        log.info("Found {} patients matching query: {}", patients.size(), query);
        return ResponseEntity.ok(patients);
    }
} 