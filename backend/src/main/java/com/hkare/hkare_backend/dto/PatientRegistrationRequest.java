package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Users.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDateTime dateOfBirth;
    private Gender gender;
    private String bloodGroup;
    private Double height;
    private Double weight;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String insuranceProvider;
    private String insuranceId;
    private String primaryDoctorId;
} 