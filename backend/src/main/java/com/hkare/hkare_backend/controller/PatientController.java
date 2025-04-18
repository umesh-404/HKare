package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.PatientDetailsRequest;
import com.hkare.hkare_backend.dto.PatientResponse;
import com.hkare.hkare_backend.service.PatientService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/patients", "/api/patients"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PatientController {

    private final PatientService patientService;
    
    @PostConstruct
    public void init() {
        log.info("PatientController initialized with mappings: /patients and /api/patients");
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
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Get a patient by ID
     * @param patientId ID of the patient
     * @return Patient data
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<?> getPatientById(@PathVariable String patientId) {
        log.info("Received request to get patient with ID: {}", patientId);
        try {
            PatientResponse patient = patientService.getPatientById(patientId);
            log.info("Returning patient with ID: {}", patient.getPatientId());
            return ResponseEntity.ok(patient);
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            log.error("Error fetching patient with ID: {}", patientId, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error fetching patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Create a new patient
     * @param request Patient details
     * @return Created patient data
     */
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody PatientDetailsRequest request) {
        log.info("Received request to create a new patient");
        try {
            PatientResponse created = patientService.createPatient(request);
            log.info("Created patient with ID: {}", created.getPatientId());
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating patient", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error creating patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Update a patient
     * @param patientId ID of the patient
     * @param request Updated patient details
     * @return Updated patient data
     */
    @PutMapping("/{patientId}")
    public ResponseEntity<?> updatePatient(
            @PathVariable String patientId,
            @RequestBody PatientDetailsRequest request) {
        log.info("Received request to update patient with ID: {}", patientId);
        try {
            PatientResponse updated = patientService.updatePatient(patientId, request);
            log.info("Updated patient with ID: {}", updated.getPatientId());
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            log.error("Error updating patient with ID: {}", patientId, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error updating patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Delete a patient
     * @param patientId ID of the patient
     * @return No content response
     */
    @DeleteMapping("/{patientId}")
    public ResponseEntity<?> deletePatient(@PathVariable String patientId) {
        log.info("Received request to delete patient with ID: {}", patientId);
        try {
            patientService.deletePatient(patientId);
            log.info("Deleted patient with ID: {}", patientId);
            return ResponseEntity.ok().body(Map.of("message", "Patient deleted successfully"));
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            log.error("Error deleting patient with ID: {}", patientId, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error deleting patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Search patients by name
     * @param query Search query
     * @return List of matching patients
     */
    @GetMapping("/search")
    public ResponseEntity<List<PatientResponse>> searchPatients(@RequestParam String query) {
        log.info("Received request to search patients with query: {}", query);
        try {
            List<PatientResponse> patients = patientService.searchPatients(query);
            log.info("Found {} patients matching query: {}", patients.size(), query);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            log.error("Error searching patients with query: {}", query, e);
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}