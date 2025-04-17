package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.DoctorResponse;
import com.hkare.hkare_backend.service.DoctorService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
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
} 