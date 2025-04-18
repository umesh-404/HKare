package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.Appointment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    private String patientId;
    private String doctorId;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Appointment.AppointmentStatus status;
    private String reason;
    private String notes;
    private Long departmentId;
    private Double appointmentFee;
    private Boolean isPaid;
} 