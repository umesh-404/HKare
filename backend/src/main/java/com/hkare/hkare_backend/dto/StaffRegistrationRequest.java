package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Users.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    
    // Field to hold the date of birth as string from the frontend
    private String dateOfBirth;
    
    // Field to hold the gender as string from the frontend
    private String gender;
    
    private String departmentId;
    private String position;
    private String hireDate;
    private boolean isAdmin;
    
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
    
    // Helper method to convert string hireDate to LocalDate
    public LocalDate getHireDateAsLocalDate() {
        if (hireDate == null || hireDate.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(hireDate);
        } catch (Exception e) {
            return null;
        }
    }
    
    // Helper method to convert string departmentId to Long
    public Long getDepartmentIdAsLong() {
        if (departmentId == null || departmentId.isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(departmentId);
        } catch (Exception e) {
            return null;
        }
    }
} 