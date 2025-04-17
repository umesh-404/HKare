package com.hkare.hkare_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Enumerated(EnumType.STRING)
    private RecordType recordType;
    
    private String diagnosis;
    private String symptoms;
    private String treatment;
    private String notes;
    private String prescription;
    private String testResults;
    
    @Column(columnDefinition = "TEXT")
    private String medicalHistory;
    
    private LocalDateTime recordDate;
    private LocalDateTime nextAppointment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (recordDate == null) {
            recordDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum RecordType {
        GENERAL_CHECKUP, EMERGENCY, FOLLOW_UP, SURGERY, LAB_TEST, IMAGING, VACCINATION, CONSULTATION
    }
} 