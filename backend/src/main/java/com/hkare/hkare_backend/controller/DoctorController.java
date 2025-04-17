package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.DoctorRegistrationRequest;
import com.hkare.hkare_backend.dto.DoctorResponse;
import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.service.DoctorService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping({"/doctors", "/api/doctors"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {
    private final DoctorService doctorService;
    
    @PostConstruct
    public void init() {
        System.out.println("DoctorController initialized with mappings: /doctors and /api/doctors");
    }
    
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        System.out.println("GET request received at /doctors or /api/doctors");
        try {
            List<DoctorResponse> doctorResponses = doctorService.getAllDoctorResponses();
            System.out.println("Retrieved " + doctorResponses.size() + " doctors");
            return ResponseEntity.ok(doctorResponses);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching doctors: " + e.getMessage());
            e.printStackTrace();
            // Return an empty list instead of failing
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable String doctorId) {
        return doctorService.getDoctorResponseById(doctorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<RegistrationResponse> createDoctor(@RequestBody DoctorRegistrationRequest request) {
        System.out.println("POST request received to create new doctor: " + request.getFirstName() + " " + request.getLastName());
        try {
            RegistrationResponse response = doctorService.createDoctor(request);
            if (response.isSuccess()) {
                System.out.println("Doctor created successfully with ID: " + response.getRoleId());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                System.err.println("Failed to create doctor: " + response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error creating doctor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(RegistrationResponse.builder()
                            .success(false)
                            .message("Error creating doctor: " + e.getMessage())
                            .build());
        }
    }
    
    @PutMapping("/{doctorId}")
    public ResponseEntity<?> updateDoctor(@PathVariable String doctorId, @RequestBody DoctorRegistrationRequest request) {
        System.out.println("PUT request received to update doctor: " + doctorId);
        try {
            DoctorResponse response = doctorService.updateDoctor(doctorId, request);
            System.out.println("Doctor updated successfully: " + doctorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating doctor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating doctor: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String doctorId) {
        System.out.println("DELETE request received for doctor: " + doctorId);
        try {
            boolean deleted = doctorService.deleteDoctor(doctorId);
            if (deleted) {
                System.out.println("Doctor deleted successfully: " + doctorId);
                return ResponseEntity.ok().build();
            } else {
                System.err.println("Doctor not found: " + doctorId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting doctor: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting doctor: " + e.getMessage());
        }
    }
} 