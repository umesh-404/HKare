package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.MedicalRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordResponse {
    private Long recordId;
    
    // Patient info
    private String patientId;
    private String patientName;
    
    // Doctor info
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    
    // Appointment info
    private Long appointmentId;
    private LocalDateTime appointmentDateTime;
    
    // Record details
    private MedicalRecord.RecordType recordType;
    private String diagnosis;
    private String symptoms;
    private String treatment;
    private String notes;
    private String prescription;
    private String testResults;
    private String medicalHistory;
    private LocalDateTime recordDate;
    private LocalDateTime nextAppointment;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
 