package com.hkare.hkare_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private String patientId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String gender;
    private LocalDateTime dateOfBirth;
    private String bloodGroup;
    private Double height;
    private Double weight;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String insuranceProvider;
    private String insuranceId;
    private DoctorMinimalResponse primaryDoctor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 