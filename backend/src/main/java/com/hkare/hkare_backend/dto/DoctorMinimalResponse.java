package com.hkare.hkare_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorMinimalResponse {
    private String doctorId;
    private String firstName;
    private String lastName;
    private String specialization;
} 