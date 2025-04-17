package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Appointment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long appointmentId;
    
    // Patient info
    private String patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    
    // Doctor info
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    
    // Department info
    private Long departmentId;
    private String departmentName;
    
    // Appointment details
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Appointment.AppointmentStatus status;
    private String reason;
    private String notes;
    
    // Payment info
    private Double appointmentFee;
    private Boolean isPaid;
} 