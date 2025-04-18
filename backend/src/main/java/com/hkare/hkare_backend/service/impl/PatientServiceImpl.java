package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.DoctorMinimalResponse;
import com.hkare.hkare_backend.dto.PatientDetailsRequest;
import com.hkare.hkare_backend.dto.PatientResponse;
import jakarta.persistence.EntityNotFoundException;
import com.hkare.hkare_backend.model.*;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.repository.PatientRepository;
import com.hkare.hkare_backend.repository.UserRepository;
import com.hkare.hkare_backend.service.IDGeneratorService;
import com.hkare.hkare_backend.service.PasswordService;
import com.hkare.hkare_backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordService passwordService;
    private final IDGeneratorService idGeneratorService;
    
    @Override
    @Transactional(readOnly = true)
    public List<PatientResponse> getAllPatients() {
        try {
            log.info("Fetching all patients from database");
            List<Patient> patients = patientRepository.findAll();
            log.info("Found {} patients in database", patients.size());
            
            List<PatientResponse> responses = patients.stream()
                    .map(this::mapToPatientResponse)
                    .collect(Collectors.toList());
            log.info("Mapped patients to {} response objects", responses.size());
            return responses;
        } catch (Exception e) {
            log.error("Error fetching all patients: {}", e.getMessage(), e);
            return new ArrayList<>(); // Return empty list instead of failing
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String patientId) {
        log.info("Fetching patient with ID: {}", patientId);
        try {
            Patient patient = patientRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
            log.info("Found patient: {}", patient.getPatientId());
            return mapToPatientResponse(patient);
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            throw e;
        } catch (Exception e) {
            log.error("Error fetching patient with ID: {}", patientId, e);
            throw new RuntimeException("Error fetching patient", e);
        }
    }

    @Override
    @Transactional
    public PatientResponse createPatient(PatientDetailsRequest request) {
        log.info("Creating new patient");
        try {
            // Create user account
            Users user = new Users();
            user.setEmail(request.getEmail());
            user.setPassword(passwordService.encodePassword(request.getPassword()));
            user.setUserType(Users.UserType.PATIENT);
            user.setPhoneNumber(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            
            if (request.getGender() != null && !request.getGender().isEmpty()) {
                user.setGender(Users.Gender.valueOf(request.getGender()));
            }
            
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
                user.setDateOfBirth(LocalDateTime.parse(request.getDateOfBirth()));
            }
            
            log.debug("Saving user account");
            user = userRepository.save(user);
            
            // Create patient
            Patient patient = new Patient();
            patient.setPatientId(generatePatientId());
            patient.setUser(user);
            patient.setFirstName(request.getFirstName());
            patient.setLastName(request.getLastName());
            patient.setBloodGroup(request.getBloodGroup());
            patient.setHeight(request.getHeight());
            patient.setWeight(request.getWeight());
            patient.setAllergies(request.getAllergies());
            patient.setEmergencyContactName(request.getEmergencyContactName());
            patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
            patient.setInsuranceProvider(request.getInsuranceProvider());
            patient.setInsuranceId(request.getInsuranceId());
            
            if (request.getPrimaryDoctorId() != null && !request.getPrimaryDoctorId().isEmpty()) {
                log.debug("Fetching primary doctor with ID: {}", request.getPrimaryDoctorId());
                Doctor primaryDoctor = doctorRepository.findByDoctorId(request.getPrimaryDoctorId())
                        .orElse(null);
                patient.setPrimaryDoctor(primaryDoctor);
            }
            
            log.debug("Saving patient");
            patient = patientRepository.save(patient);
            log.info("Created patient with ID: {}", patient.getPatientId());
            return mapToPatientResponse(patient);
        } catch (Exception e) {
            log.error("Error creating patient", e);
            throw new RuntimeException("Error creating patient", e);
        }
    }

    @Override
    @Transactional
    public PatientResponse updatePatient(String patientId, PatientDetailsRequest request) {
        log.info("Updating patient with ID: {}", patientId);
        try {
            Patient patient = patientRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
            
            Users user = patient.getUser();
            
            // Update user data
            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordService.encodePassword(request.getPassword()));
            }
            
            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber());
            }
            
            if (request.getAddress() != null) {
                user.setAddress(request.getAddress());
            }
            
            if (request.getGender() != null && !request.getGender().isEmpty()) {
                user.setGender(Users.Gender.valueOf(request.getGender()));
            }
            
            if (request.getDateOfBirth() != null && !request.getDateOfBirth().isEmpty()) {
                user.setDateOfBirth(LocalDateTime.parse(request.getDateOfBirth()));
            }
            
            log.debug("Saving updated user data");
            userRepository.save(user);
            
            // Update patient data
            if (request.getFirstName() != null) {
                patient.setFirstName(request.getFirstName());
            }
            
            if (request.getLastName() != null) {
                patient.setLastName(request.getLastName());
            }
            
            if (request.getBloodGroup() != null) {
                patient.setBloodGroup(request.getBloodGroup());
            }
            
            if (request.getHeight() != null) {
                patient.setHeight(request.getHeight());
            }
            
            if (request.getWeight() != null) {
                patient.setWeight(request.getWeight());
            }
            
            if (request.getAllergies() != null) {
                patient.setAllergies(request.getAllergies());
            }
            
            if (request.getEmergencyContactName() != null) {
                patient.setEmergencyContactName(request.getEmergencyContactName());
            }
            
            if (request.getEmergencyContactPhone() != null) {
                patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
            }
            
            if (request.getInsuranceProvider() != null) {
                patient.setInsuranceProvider(request.getInsuranceProvider());
            }
            
            if (request.getInsuranceId() != null) {
                patient.setInsuranceId(request.getInsuranceId());
            }
            
            if (request.getPrimaryDoctorId() != null) {
                if (request.getPrimaryDoctorId().isEmpty()) {
                    patient.setPrimaryDoctor(null);
                } else {
                    log.debug("Fetching primary doctor with ID: {}", request.getPrimaryDoctorId());
                    Doctor primaryDoctor = doctorRepository.findByDoctorId(request.getPrimaryDoctorId())
                            .orElse(null);
                    patient.setPrimaryDoctor(primaryDoctor);
                }
            }
            
            log.debug("Saving updated patient data");
            patient = patientRepository.save(patient);
            log.info("Updated patient with ID: {}", patient.getPatientId());
            return mapToPatientResponse(patient);
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            throw e;
        } catch (Exception e) {
            log.error("Error updating patient with ID: {}", patientId, e);
            throw new RuntimeException("Error updating patient", e);
        }
    }

    @Override
    @Transactional
    public void deletePatient(String patientId) {
        log.info("Deleting patient with ID: {}", patientId);
        try {
            Patient patient = patientRepository.findByPatientId(patientId)
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
            
            Users user = patient.getUser();
            
            log.debug("Deleting patient entity");
            patientRepository.delete(patient);
            log.debug("Deleting user entity");
            userRepository.delete(user);
            log.info("Deleted patient with ID: {}", patientId);
        } catch (EntityNotFoundException e) {
            log.warn("Patient not found with ID: {}", patientId);
            throw e;
        } catch (Exception e) {
            log.error("Error deleting patient with ID: {}", patientId, e);
            throw new RuntimeException("Error deleting patient", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponse> searchPatients(String query) {
        log.info("Searching patients with query: {}", query);
        try {
            String lowercaseQuery = query.toLowerCase();
            
            List<Patient> matchingPatients = patientRepository.findAll().stream()
                    .filter(patient -> 
                        patient.getFirstName().toLowerCase().contains(lowercaseQuery) ||
                        patient.getLastName().toLowerCase().contains(lowercaseQuery) ||
                        patient.getPatientId().toLowerCase().contains(lowercaseQuery) ||
                        (patient.getUser() != null && patient.getUser().getEmail() != null && 
                         patient.getUser().getEmail().toLowerCase().contains(lowercaseQuery)))
                    .collect(Collectors.toList());
            
            log.info("Found {} patients matching query: {}", matchingPatients.size(), query);
            return matchingPatients.stream()
                    .map(this::mapToPatientResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching patients with query: {}", query, e);
            return new ArrayList<>();
        }
    }
    
    private PatientResponse mapToPatientResponse(Patient patient) {
        try {
            PatientResponse response = new PatientResponse();
            response.setPatientId(patient.getPatientId());
            response.setFirstName(patient.getFirstName());
            response.setLastName(patient.getLastName());
            response.setBloodGroup(patient.getBloodGroup());
            response.setHeight(patient.getHeight());
            response.setWeight(patient.getWeight());
            response.setAllergies(patient.getAllergies());
            response.setEmergencyContactName(patient.getEmergencyContactName());
            response.setEmergencyContactPhone(patient.getEmergencyContactPhone());
            response.setInsuranceProvider(patient.getInsuranceProvider());
            response.setInsuranceId(patient.getInsuranceId());
            response.setCreatedAt(patient.getCreatedAt());
            response.setUpdatedAt(patient.getUpdatedAt());
            
            Users user = patient.getUser();
            if (user != null) {
                response.setEmail(user.getEmail());
                response.setPhoneNumber(user.getPhoneNumber());
                response.setAddress(user.getAddress());
                response.setDateOfBirth(user.getDateOfBirth());
                
                if (user.getGender() != null) {
                    response.setGender(user.getGender().name());
                }
            }
            
            Doctor primaryDoctor = patient.getPrimaryDoctor();
            if (primaryDoctor != null) {
                DoctorMinimalResponse doctorResponse = new DoctorMinimalResponse();
                doctorResponse.setDoctorId(primaryDoctor.getDoctorId());
                doctorResponse.setFirstName(primaryDoctor.getFirstName());
                doctorResponse.setLastName(primaryDoctor.getLastName());
                doctorResponse.setSpecialization(primaryDoctor.getSpecialization());
                response.setPrimaryDoctor(doctorResponse);
            }
            
            return response;
        } catch (Exception e) {
            log.error("Error mapping patient to response", e);
            throw new RuntimeException("Error mapping patient to response", e);
        }
    }
    
    private String generatePatientId() {
        try {
            String patientId;
            do {
                patientId = idGeneratorService.generatePatientId();
                log.debug("Generated patient ID: {}", patientId);
            } while (patientRepository.existsByPatientId(patientId));
            
            return patientId;
        } catch (Exception e) {
            log.error("Error generating patient ID", e);
            throw new RuntimeException("Error generating patient ID", e);
        }
    }
} 