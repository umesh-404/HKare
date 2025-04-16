package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Users.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private String userId;
    private String roleId;  // doctorId, patientId, staffId, adminId
    private String email;
    private String firstName;
    private String lastName;
    private UserType userType;
    private boolean success;
    private String message;
} 