package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Doctor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    private String doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String gender;
    private LocalDateTime dateOfBirth;
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
                .phoneNumber(doctor.getUser() != null ? doctor.getUser().getPhoneNumber() : null)
                .address(doctor.getUser() != null ? doctor.getUser().getAddress() : null)
                .gender(doctor.getUser() != null && doctor.getUser().getGender() != null ? 
                        doctor.getUser().getGender().name() : null)
                .dateOfBirth(doctor.getUser() != null ? doctor.getUser().getDateOfBirth() : null)
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