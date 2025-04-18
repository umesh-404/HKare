package com.hkare.hkare_backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Random;

@Service
public class IDGeneratorService {
    private static final String DOCTOR_PREFIX = "D";
    private static final String PATIENT_PREFIX = "P";
    private static final String STAFF_PREFIX = "S";
    private static final String ADMIN_PREFIX = "A";
    private static final int ID_LENGTH = 5;
    
    private final Random random = new SecureRandom();
    
    public String generateDoctorId() {
        return generateId(DOCTOR_PREFIX);
    }
    
    public String generatePatientId() {
        return generateId(PATIENT_PREFIX);
    }
    
    public String generateStaffId() {
        return generateId(STAFF_PREFIX);
    }
    
    public String generateAdminId() {
        return generateId(ADMIN_PREFIX);
    }
    
    private String generateId(String prefix) {
        StringBuilder builder = new StringBuilder(prefix);
        for (int i = 0; i < ID_LENGTH; i++) {
            builder.append(random.nextInt(10));
        }
        return builder.toString();
    }
} 