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
public class StaffProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDateTime dateOfBirth;
    private Gender gender;
    private Long departmentId;
    private String position;
    private LocalDate hireDate;
} 