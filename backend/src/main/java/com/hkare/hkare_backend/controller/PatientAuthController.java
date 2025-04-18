package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.LoginRequest;
import com.hkare.hkare_backend.dto.LoginResponse;
import com.hkare.hkare_backend.dto.PatientRegistrationRequest;
import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/auth/patient", "/api/auth/patient"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientAuthController {
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.loginPatient(request);
        if (response.isAuthenticated()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@RequestBody PatientRegistrationRequest request) {
        RegistrationResponse response = authService.registerPatient(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
} 