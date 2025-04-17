package com.hkare.hkare_backend.dto;

import com.hkare.hkare_backend.model.MedicalRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordRequest {
    private String patientId;
    private String doctorId;
    private Long appointmentId;
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
} 