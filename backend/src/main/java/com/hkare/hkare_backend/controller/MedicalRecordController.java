package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.MedicalRecordRequest;
import com.hkare.hkare_backend.dto.MedicalRecordResponse;
import com.hkare.hkare_backend.model.MedicalRecord;
import com.hkare.hkare_backend.service.MedicalRecordService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/medical-records", "/api/medical-records"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;
    
    @PostConstruct
    public void init() {
        System.out.println("MedicalRecordController initialized with mappings: /medical-records and /api/medical-records");
    }
    
    @PostMapping
    public ResponseEntity<MedicalRecordResponse> createMedicalRecord(@Valid @RequestBody MedicalRecordRequest request) {
        System.out.println("POST request to create medical record for patient: " + request.getPatientId());
        try {
            MedicalRecordResponse response = medicalRecordService.createMedicalRecord(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("Error creating medical record: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecordResponse> getMedicalRecord(@PathVariable Long recordId) {
        System.out.println("GET request for medical record ID: " + recordId);
        return medicalRecordService.getMedicalRecordById(recordId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecordResponse> updateMedicalRecord(
            @PathVariable Long recordId,
            @Valid @RequestBody MedicalRecordRequest request) {
        System.out.println("PUT request to update medical record ID: " + recordId);
        try {
            MedicalRecordResponse response = medicalRecordService.updateMedicalRecord(recordId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating medical record: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long recordId) {
        System.out.println("DELETE request for medical record ID: " + recordId);
        boolean deleted = medicalRecordService.deleteMedicalRecord(recordId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getAllMedicalRecords() {
        System.out.println("GET request for all medical records");
        return ResponseEntity.ok(medicalRecordService.getAllMedicalRecords());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(@PathVariable String patientId) {
        System.out.println("GET request for medical records of patient ID: " + patientId);
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(@PathVariable String doctorId) {
        System.out.println("GET request for medical records of doctor ID: " + doctorId);
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(doctorId));
    }
    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByAppointment(@PathVariable Long appointmentId) {
        System.out.println("GET request for medical records of appointment ID: " + appointmentId);
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByAppointment(appointmentId));
    }
    
    @GetMapping("/type/{recordType}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByType(
            @PathVariable MedicalRecord.RecordType recordType) {
        System.out.println("GET request for medical records with type: " + recordType);
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByType(recordType));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        System.out.println("GET request for medical records between: " + startDate + " and " + endDate);
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsBetweenDates(startDate, endDate));
    }
    
    @GetMapping("/patient/{patientId}/type/{recordType}")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientMedicalRecordsByType(
            @PathVariable String patientId,
            @PathVariable MedicalRecord.RecordType recordType) {
        System.out.println("GET request for medical records of patient ID: " + patientId + " with type: " + recordType);
        return ResponseEntity.ok(medicalRecordService.getPatientMedicalRecordsByType(patientId, recordType));
    }
    
    @GetMapping("/patient/{patientId}/diagnoses")
    public ResponseEntity<List<String>> getPatientDiagnoses(@PathVariable String patientId) {
        System.out.println("GET request for diagnoses of patient ID: " + patientId);
        return ResponseEntity.ok(medicalRecordService.getPatientDiagnoses(patientId));
    }
    
    @GetMapping("/patient/{patientId}/count-by-type")
    public ResponseEntity<Map<MedicalRecord.RecordType, Long>> countPatientRecordsByType(@PathVariable String patientId) {
        System.out.println("GET request for count of medical records by type for patient ID: " + patientId);
        Map<MedicalRecord.RecordType, Long> counts = medicalRecordService.countPatientRecordsByType(patientId);
        return ResponseEntity.ok(counts);
    }
} 