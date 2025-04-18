package com.hkare.hkare_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyRequest {
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phoneNumber;
    private String email;
    private String website;
    private String licenseNumber;
    private Boolean isActive;
    
    // Add missing fields
    private Double latitude;
    private Double longitude;
    private String operatingHours;
} 