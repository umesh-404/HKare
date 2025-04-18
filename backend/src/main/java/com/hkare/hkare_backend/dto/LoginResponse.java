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
public class LoginResponse {
    private String userId;
    private String roleId;  // doctorId, patientId, staffId, adminId
    private String firstName;
    private String lastName;
    private String email;
    private UserType userType;
    private boolean isAuthenticated;
    private String message;
} 