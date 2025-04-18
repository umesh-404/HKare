package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.*;

public interface AuthService {
    // Doctor authentication
    LoginResponse loginDoctor(LoginRequest request);
    RegistrationResponse registerDoctor(DoctorRegistrationRequest request);
    
    // Patient authentication
    LoginResponse loginPatient(LoginRequest request);
    RegistrationResponse registerPatient(PatientRegistrationRequest request);
    
    // Staff/Admin authentication
    LoginResponse loginStaff(LoginRequest request);
    RegistrationResponse registerStaff(StaffRegistrationRequest request);
} 