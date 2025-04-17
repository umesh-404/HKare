package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.DoctorResponse;
import com.hkare.hkare_backend.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    /**
     * Get all doctors
     * @return List of all doctors
     */
    List<Doctor> getAllDoctors();
    
    /**
     * Get all doctor responses
     * @return List of all doctor responses
     */
    List<DoctorResponse> getAllDoctorResponses();
    
    /**
     * Get doctor by ID
     * @param doctorId Doctor ID
     * @return Optional containing doctor if found
     */
    Optional<Doctor> getDoctorById(String doctorId);
    
    /**
     * Get doctor response by ID
     * @param doctorId Doctor ID
     * @return Optional containing doctor response if found
     */
    Optional<DoctorResponse> getDoctorResponseById(String doctorId);
} 