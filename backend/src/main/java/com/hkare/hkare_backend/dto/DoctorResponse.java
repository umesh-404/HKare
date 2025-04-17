package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Doctor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private String doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String licenseNumber;
    private Double consultationFee;
    private String bio;
    private Double rating;
    private Long departmentId;
    private String departmentName;
    
    public static DoctorResponse fromDoctor(Doctor doctor) {
        return DoctorResponse.builder()
                .doctorId(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getUser() != null ? doctor.getUser().getEmail() : null)
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .licenseNumber(doctor.getLicenseNumber())
                .consultationFee(doctor.getConsultationFee())
                .bio(doctor.getBio())
                .rating(doctor.getRating())
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getDepartmentId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .build();
    }
} 