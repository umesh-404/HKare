package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.PrescriptionRequest;
import com.hkare.hkare_backend.dto.PrescriptionResponse;
import com.hkare.hkare_backend.model.*;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.repository.MedicalRecordRepository;
import com.hkare.hkare_backend.repository.PatientRepository;
import com.hkare.hkare_backend.repository.PharmacyRepository;
import com.hkare.hkare_backend.repository.PrescriptionRepository;
import com.hkare.hkare_backend.service.PrescriptionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PharmacyRepository pharmacyRepository;
    
    @Override
    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        Prescription prescription = mapRequestToEntity(request);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return mapEntityToResponse(savedPrescription);
    }
    
    @Override
    @Transactional
    public PrescriptionResponse updatePrescription(Long prescriptionId, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found with ID: " + prescriptionId));
        
        updatePrescriptionFromRequest(prescription, request);
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapEntityToResponse(updatedPrescription);
    }
    
    @Override
    public Optional<PrescriptionResponse> getPrescriptionById(Long prescriptionId) {
        return prescriptionRepository.findById(prescriptionId)
                .map(this::mapEntityToResponse);
    }
    
    @Override
    @Transactional
    public boolean deletePrescription(Long prescriptionId) {
        if (prescriptionRepository.existsById(prescriptionId)) {
            prescriptionRepository.deleteById(prescriptionId);
            return true;
        }
        return false;
    }
    
    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findPatientPrescriptions(patientId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByDoctor(String doctorId) {
        return prescriptionRepository.findDoctorPrescriptions(doctorId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByPharmacy(Long pharmacyId) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + pharmacyId));
        
        return prescriptionRepository.findByPharmacy(pharmacy).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsByStatus(Prescription.PrescriptionStatus status) {
        return prescriptionRepository.findByStatus(status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPrescriptionsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return prescriptionRepository.findPrescriptionsBetweenDates(startDate, endDate).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getPatientPrescriptionsByStatus(String patientId, Prescription.PrescriptionStatus status) {
        return prescriptionRepository.findPatientPrescriptionsByStatus(patientId, status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PrescriptionResponse> getDoctorPrescriptionsByStatus(String doctorId, Prescription.PrescriptionStatus status) {
        return prescriptionRepository.findDoctorPrescriptionsByStatus(doctorId, status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public PrescriptionResponse updatePrescriptionStatus(Long prescriptionId, Prescription.PrescriptionStatus status) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found with ID: " + prescriptionId));
        
        prescription.setStatus(status);
        
        // If status is COMPLETED or EXPIRED, make sure no more refills can be processed
        if (status == Prescription.PrescriptionStatus.COMPLETED || status == Prescription.PrescriptionStatus.EXPIRED || 
            status == Prescription.PrescriptionStatus.CANCELLED) {
            prescription.setRefillsRemaining(0);
        }
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapEntityToResponse(updatedPrescription);
    }
    
    @Override
    @Transactional
    public PrescriptionResponse processPrescriptionRefill(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Prescription not found with ID: " + prescriptionId));
        
        if (!prescription.getIsRefillable()) {
            throw new IllegalStateException("This prescription is not refillable");
        }
        
        if (prescription.getStatus() != Prescription.PrescriptionStatus.ACTIVE) {
            throw new IllegalStateException("Cannot refill prescription with status: " + prescription.getStatus());
        }
        
        if (prescription.getRefillsRemaining() <= 0) {
            throw new IllegalStateException("No refills remaining for this prescription");
        }
        
        // Process the refill
        prescription.setRefillsRemaining(prescription.getRefillsRemaining() - 1);
        
        // If no more refills remaining, mark as completed
        if (prescription.getRefillsRemaining() <= 0) {
            prescription.setStatus(Prescription.PrescriptionStatus.COMPLETED);
        }
        
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return mapEntityToResponse(updatedPrescription);
    }
    
    @Override
    public List<PrescriptionResponse> findExpiredPrescriptions() {
        LocalDate today = LocalDate.now();
        return prescriptionRepository.findExpiredPrescriptions(today).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countDoctorPrescriptionsByDate(String doctorId, LocalDate date) {
        return prescriptionRepository.countDoctorPrescriptionsByDate(doctorId, date);
    }
    
    @Override
    public long countPatientPrescriptionsInPeriod(String patientId, LocalDate startDate, LocalDate endDate) {
        return prescriptionRepository.countPatientPrescriptionsInPeriod(patientId, startDate, endDate);
    }
    
    private Prescription mapRequestToEntity(PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        
        MedicalRecord medicalRecord = null;
        if (request.getMedicalRecordId() != null) {
            medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
                    .orElseThrow(() -> new EntityNotFoundException("Medical record not found with ID: " + request.getMedicalRecordId()));
        }
        
        Pharmacy pharmacy = null;
        if (request.getPharmacyId() != null) {
            pharmacy = pharmacyRepository.findById(request.getPharmacyId())
                    .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + request.getPharmacyId()));
        }
        
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setMedicalRecord(medicalRecord);
        prescription.setPharmacy(pharmacy);
        prescription.setPrescriptionDate(request.getPrescriptionDate() != null ? request.getPrescriptionDate() : LocalDate.now());
        prescription.setExpiryDate(request.getExpiryDate());
        prescription.setStatus(request.getStatus() != null ? request.getStatus() : Prescription.PrescriptionStatus.ACTIVE);
        prescription.setNotes(request.getNotes());
        prescription.setIsRefillable(request.getIsRefillable() != null ? request.getIsRefillable() : false);
        prescription.setTotalRefills(request.getTotalRefills());
        prescription.setRefillsRemaining(request.getTotalRefills());
        
        // Map medications
        if (request.getMedications() != null && !request.getMedications().isEmpty()) {
            List<Prescription.PrescriptionMedication> medications = new ArrayList<>();
            for (PrescriptionRequest.MedicationItem item : request.getMedications()) {
                Prescription.PrescriptionMedication medication = new Prescription.PrescriptionMedication();
                medication.setMedicationName(item.getMedicationName());
                medication.setDosage(item.getDosage());
                medication.setFrequency(item.getFrequency());
                medication.setInstructions(item.getInstructions());
                medication.setQuantity(item.getQuantity());
                medication.setDuration(item.getDuration());
                medications.add(medication);
            }
            prescription.setMedications(medications);
        }
        
        return prescription;
    }
    
    private void updatePrescriptionFromRequest(Prescription prescription, PrescriptionRequest request) {
        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
            prescription.setPatient(patient);
        }
        
        if (request.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
            prescription.setDoctor(doctor);
        }
        
        if (request.getMedicalRecordId() != null) {
            MedicalRecord medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
                    .orElseThrow(() -> new EntityNotFoundException("Medical record not found with ID: " + request.getMedicalRecordId()));
            prescription.setMedicalRecord(medicalRecord);
        }
        
        if (request.getPharmacyId() != null) {
            Pharmacy pharmacy = pharmacyRepository.findById(request.getPharmacyId())
                    .orElseThrow(() -> new EntityNotFoundException("Pharmacy not found with ID: " + request.getPharmacyId()));
            prescription.setPharmacy(pharmacy);
        }
        
        if (request.getPrescriptionDate() != null) {
            prescription.setPrescriptionDate(request.getPrescriptionDate());
        }
        
        if (request.getExpiryDate() != null) {
            prescription.setExpiryDate(request.getExpiryDate());
        }
        
        if (request.getStatus() != null) {
            prescription.setStatus(request.getStatus());
        }
        
        prescription.setNotes(request.getNotes());
        
        if (request.getIsRefillable() != null) {
            boolean wasRefillable = prescription.getIsRefillable() != null ? prescription.getIsRefillable() : false;
            prescription.setIsRefillable(request.getIsRefillable());
            
            // If refillable status has changed, adjust refillsRemaining
            if (!wasRefillable && request.getIsRefillable() && request.getTotalRefills() != null) {
                prescription.setTotalRefills(request.getTotalRefills());
                prescription.setRefillsRemaining(request.getTotalRefills());
            } else if (request.getTotalRefills() != null) {
                // Update total refills and remaining refills if provided
                int currentRemaining = prescription.getRefillsRemaining() != null ? prescription.getRefillsRemaining() : 0;
                int currentTotal = prescription.getTotalRefills() != null ? prescription.getTotalRefills() : 0;
                int difference = request.getTotalRefills() - currentTotal;
                
                prescription.setTotalRefills(request.getTotalRefills());
                prescription.setRefillsRemaining(Math.max(0, currentRemaining + difference));
            }
        }
        
        // Update medications if provided
        if (request.getMedications() != null && !request.getMedications().isEmpty()) {
            List<Prescription.PrescriptionMedication> medications = new ArrayList<>();
            for (PrescriptionRequest.MedicationItem item : request.getMedications()) {
                Prescription.PrescriptionMedication medication = new Prescription.PrescriptionMedication();
                medication.setMedicationName(item.getMedicationName());
                medication.setDosage(item.getDosage());
                medication.setFrequency(item.getFrequency());
                medication.setInstructions(item.getInstructions());
                medication.setQuantity(item.getQuantity());
                medication.setDuration(item.getDuration());
                medications.add(medication);
            }
            prescription.setMedications(medications);
        }
    }
    
    private PrescriptionResponse mapEntityToResponse(Prescription prescription) {
        PrescriptionResponse.PrescriptionResponseBuilder builder = PrescriptionResponse.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .patientId(prescription.getPatient().getPatientId())
                .patientName(prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName())
                .doctorId(prescription.getDoctor().getDoctorId())
                .doctorName("Dr. " + prescription.getDoctor().getFirstName() + " " + prescription.getDoctor().getLastName())
                .prescriptionDate(prescription.getPrescriptionDate())
                .expiryDate(prescription.getExpiryDate())
                .status(prescription.getStatus())
                .notes(prescription.getNotes())
                .isRefillable(prescription.getIsRefillable())
                .refillsRemaining(prescription.getRefillsRemaining())
                .totalRefills(prescription.getTotalRefills())
                .createdAt(prescription.getCreatedAt())
                .updatedAt(prescription.getUpdatedAt());
        
        if (prescription.getMedicalRecord() != null) {
            builder.medicalRecordId(prescription.getMedicalRecord().getRecordId());
        }
        
        // Map medications
        if (prescription.getMedications() != null && !prescription.getMedications().isEmpty()) {
            List<PrescriptionResponse.MedicationItem> medicationItems = new ArrayList<>();
            for (Prescription.PrescriptionMedication medication : prescription.getMedications()) {
                PrescriptionResponse.MedicationItem item = PrescriptionResponse.MedicationItem.builder()
                        .medicationName(medication.getMedicationName())
                        .dosage(medication.getDosage())
                        .frequency(medication.getFrequency())
                        .instructions(medication.getInstructions())
                        .quantity(medication.getQuantity())
                        .duration(medication.getDuration())
                        .build();
                medicationItems.add(item);
            }
            builder.medications(medicationItems);
        }
        
        // Map pharmacy info if available
        if (prescription.getPharmacy() != null) {
            Pharmacy pharmacy = prescription.getPharmacy();
            builder.pharmacyId(pharmacy.getPharmacyId())
                   .pharmacyName(pharmacy.getName())
                   .pharmacyAddress(pharmacy.getAddress())
                   .pharmacyPhone(pharmacy.getPhoneNumber());
        }
        
        return builder.build();
    }
} 