package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.MedicalRecordRequest;
import com.hkare.hkare_backend.dto.MedicalRecordResponse;
import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.MedicalRecord;
import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.repository.AppointmentRepository;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.repository.MedicalRecordRepository;
import com.hkare.hkare_backend.repository.PatientRepository;
import com.hkare.hkare_backend.service.MedicalRecordService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    
    @Override
    @Transactional
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request) {
        MedicalRecord medicalRecord = mapRequestToEntity(request);
        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
        return mapEntityToResponse(savedRecord);
    }
    
    @Override
    @Transactional
    public MedicalRecordResponse updateMedicalRecord(Long recordId, MedicalRecordRequest request) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new EntityNotFoundException("Medical record not found with ID: " + recordId));
        
        // Update medical record fields
        updateMedicalRecordFromRequest(medicalRecord, request);
        
        MedicalRecord updatedRecord = medicalRecordRepository.save(medicalRecord);
        return mapEntityToResponse(updatedRecord);
    }
    
    @Override
    public Optional<MedicalRecordResponse> getMedicalRecordById(Long recordId) {
        return medicalRecordRepository.findById(recordId)
                .map(this::mapEntityToResponse);
    }
    
    @Override
    @Transactional
    public boolean deleteMedicalRecord(Long recordId) {
        if (medicalRecordRepository.existsById(recordId)) {
            medicalRecordRepository.deleteById(recordId);
            return true;
        }
        return false;
    }
    
    @Override
    public List<MedicalRecordResponse> getAllMedicalRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        
        return medicalRecordRepository.findByPatientOrderByRecordDateDesc(patient).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByDoctor(String doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));
        
        return medicalRecordRepository.findByDoctorOrderByRecordDateDesc(doctor).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        
        return medicalRecordRepository.findByAppointment(appointment).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByType(MedicalRecord.RecordType recordType) {
        return medicalRecordRepository.findByRecordType(recordType).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getMedicalRecordsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return medicalRecordRepository.findRecordsBetweenDates(startDate, endDate).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<MedicalRecordResponse> getPatientMedicalRecordsByType(String patientId, MedicalRecord.RecordType recordType) {
        return medicalRecordRepository.findPatientRecordsByType(patientId, recordType).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<String> getPatientDiagnoses(String patientId) {
        return medicalRecordRepository.findPatientDiagnoses(patientId);
    }
    
    @Override
    public Map<MedicalRecord.RecordType, Long> countPatientRecordsByType(String patientId) {
        List<Object[]> counts = medicalRecordRepository.countPatientRecordsByType(patientId);
        Map<MedicalRecord.RecordType, Long> result = new HashMap<>();
        
        for (Object[] row : counts) {
            try {
                String typeStr = (String) row[0];
                Long count = ((Number) row[1]).longValue();
                MedicalRecord.RecordType type = MedicalRecord.RecordType.valueOf(typeStr);
                result.put(type, count);
            } catch (IllegalArgumentException e) {
                // Skip invalid record types
                System.err.println("Invalid record type: " + row[0]);
            }
        }
        
        // Fill in missing types with zero
        for (MedicalRecord.RecordType type : MedicalRecord.RecordType.values()) {
            if (!result.containsKey(type)) {
                result.put(type, 0L);
            }
        }
        
        return result;
    }
    
    private MedicalRecord mapRequestToEntity(MedicalRecordRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
        }
        
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatient(patient);
        medicalRecord.setDoctor(doctor);
        medicalRecord.setAppointment(appointment);
        medicalRecord.setRecordType(request.getRecordType() != null ? request.getRecordType() : MedicalRecord.RecordType.GENERAL_CHECKUP);
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setSymptoms(request.getSymptoms());
        medicalRecord.setTreatment(request.getTreatment());
        medicalRecord.setNotes(request.getNotes());
        medicalRecord.setPrescription(request.getPrescription());
        medicalRecord.setTestResults(request.getTestResults());
        medicalRecord.setMedicalHistory(request.getMedicalHistory());
        medicalRecord.setRecordDate(request.getRecordDate() != null ? request.getRecordDate() : LocalDateTime.now());
        medicalRecord.setNextAppointment(request.getNextAppointment());
        
        return medicalRecord;
    }
    
    private void updateMedicalRecordFromRequest(MedicalRecord medicalRecord, MedicalRecordRequest request) {
        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
            medicalRecord.setPatient(patient);
        }
        
        if (request.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
            medicalRecord.setDoctor(doctor);
        }
        
        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
            medicalRecord.setAppointment(appointment);
        }
        
        if (request.getRecordType() != null) {
            medicalRecord.setRecordType(request.getRecordType());
        }
        
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setSymptoms(request.getSymptoms());
        medicalRecord.setTreatment(request.getTreatment());
        medicalRecord.setNotes(request.getNotes());
        medicalRecord.setPrescription(request.getPrescription());
        medicalRecord.setTestResults(request.getTestResults());
        medicalRecord.setMedicalHistory(request.getMedicalHistory());
        
        if (request.getRecordDate() != null) {
            medicalRecord.setRecordDate(request.getRecordDate());
        }
        
        medicalRecord.setNextAppointment(request.getNextAppointment());
    }
    
    private MedicalRecordResponse mapEntityToResponse(MedicalRecord medicalRecord) {
        MedicalRecordResponse.MedicalRecordResponseBuilder builder = MedicalRecordResponse.builder()
                .recordId(medicalRecord.getRecordId())
                .patientId(medicalRecord.getPatient().getPatientId())
                .patientName(medicalRecord.getPatient().getFirstName() + " " + medicalRecord.getPatient().getLastName())
                .recordType(medicalRecord.getRecordType())
                .diagnosis(medicalRecord.getDiagnosis())
                .symptoms(medicalRecord.getSymptoms())
                .treatment(medicalRecord.getTreatment())
                .notes(medicalRecord.getNotes())
                .prescription(medicalRecord.getPrescription())
                .testResults(medicalRecord.getTestResults())
                .medicalHistory(medicalRecord.getMedicalHistory())
                .recordDate(medicalRecord.getRecordDate())
                .nextAppointment(medicalRecord.getNextAppointment())
                .createdAt(medicalRecord.getCreatedAt())
                .updatedAt(medicalRecord.getUpdatedAt());

        // Handle doctor information if available
        if (medicalRecord.getDoctor() != null) {
            Doctor doctor = medicalRecord.getDoctor();
            builder.doctorId(doctor.getDoctorId())
                   .doctorName("Dr. " + doctor.getFirstName() + " " + doctor.getLastName())
                   .doctorSpecialization(doctor.getSpecialization());
        } else {
            builder.doctorId(null)
                   .doctorName("Not Assigned")
                   .doctorSpecialization(null);
        }
        
        // Handle appointment information if available
        if (medicalRecord.getAppointment() != null) {
            Appointment appointment = medicalRecord.getAppointment();
            LocalDateTime appointmentDateTime = LocalDateTime.of(
                    appointment.getAppointmentDate(),
                    appointment.getStartTime() != null ? appointment.getStartTime() : LocalTime.MIDNIGHT
            );
            
            builder.appointmentId(appointment.getAppointmentId())
                   .appointmentDateTime(appointmentDateTime);
        }
        
        return builder.build();
    }
} 