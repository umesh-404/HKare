package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.PrescriptionRequest;
import com.hkare.hkare_backend.dto.PrescriptionResponse;
import com.hkare.hkare_backend.model.Prescription;
import com.hkare.hkare_backend.service.PrescriptionService;
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
@RequestMapping({"/prescriptions", "/api/prescriptions"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{prescriptionId}")
    public ResponseEntity<PrescriptionResponse> updatePrescription(
            @PathVariable Long prescriptionId,
            @Valid @RequestBody PrescriptionRequest request) {
        try {
            PrescriptionResponse response = prescriptionService.updatePrescription(prescriptionId, request);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{prescriptionId}")
    public ResponseEntity<PrescriptionResponse> getPrescriptionById(@PathVariable Long prescriptionId) {
        return prescriptionService.getPrescriptionById(prescriptionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{prescriptionId}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long prescriptionId) {
        boolean deleted = prescriptionService.deletePrescription(prescriptionId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions() {
        List<PrescriptionResponse> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByPatient(@PathVariable String patientId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByDoctor(@PathVariable String doctorId) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByDoctor(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/pharmacy/{pharmacyId}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByPharmacy(@PathVariable Long pharmacyId) {
        try {
            List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPharmacy(pharmacyId);
            return ResponseEntity.ok(prescriptions);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsByStatus(
            @PathVariable Prescription.PrescriptionStatus status) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsBetweenDates(startDate, endDate);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/patient/{patientId}/status/{status}")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptionsByStatus(
            @PathVariable String patientId,
            @PathVariable Prescription.PrescriptionStatus status) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPatientPrescriptionsByStatus(patientId, status);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}/status/{status}")
    public ResponseEntity<List<PrescriptionResponse>> getDoctorPrescriptionsByStatus(
            @PathVariable String doctorId,
            @PathVariable Prescription.PrescriptionStatus status) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getDoctorPrescriptionsByStatus(doctorId, status);
        return ResponseEntity.ok(prescriptions);
    }

    @PutMapping("/{prescriptionId}/status/{status}")
    public ResponseEntity<PrescriptionResponse> updatePrescriptionStatus(
            @PathVariable Long prescriptionId,
            @PathVariable Prescription.PrescriptionStatus status) {
        try {
            PrescriptionResponse response = prescriptionService.updatePrescriptionStatus(prescriptionId, status);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{prescriptionId}/refill")
    public ResponseEntity<?> processPrescriptionRefill(@PathVariable Long prescriptionId) {
        try {
            PrescriptionResponse response = prescriptionService.processPrescriptionRefill(prescriptionId);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/expired")
    public ResponseEntity<List<PrescriptionResponse>> findExpiredPrescriptions() {
        List<PrescriptionResponse> prescriptions = prescriptionService.findExpiredPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}/count/date")
    public ResponseEntity<Long> countDoctorPrescriptionsByDate(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        long count = prescriptionService.countDoctorPrescriptionsByDate(doctorId, date);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/patient/{patientId}/count/period")
    public ResponseEntity<Long> countPatientPrescriptionsInPeriod(
            @PathVariable String patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        long count = prescriptionService.countPatientPrescriptionsInPeriod(patientId, startDate, endDate);
        return ResponseEntity.ok(count);
    }
} 