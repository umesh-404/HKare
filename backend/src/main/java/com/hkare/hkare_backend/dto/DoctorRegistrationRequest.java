package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Users.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String dateOfBirth;
    private String gender;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String licenseNumber;
    private Double consultationFee;
    private String bio;
    private Long departmentId;
    
    // Helper method to convert string dateOfBirth to LocalDateTime
    public LocalDateTime getDateOfBirthAsLocalDateTime() {
        if (dateOfBirth == null || dateOfBirth.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateOfBirth);
        } catch (Exception e) {
            try {
                // Try with a different format (yyyy-MM-dd)
                LocalDate date = LocalDate.parse(dateOfBirth);
                return date.atStartOfDay();
            } catch (Exception ex) {
                return null;
            }
        }
    }
    
    // Helper method to convert string gender to Gender enum
    public Gender getGenderAsEnum() {
        if (gender == null || gender.isEmpty()) {
            return null;
        }
        try {
            return Gender.valueOf(gender.toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }
} 