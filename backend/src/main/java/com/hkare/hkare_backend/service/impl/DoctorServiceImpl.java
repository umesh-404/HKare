package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.DoctorResponse;
import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.DoctorRegistrationRequest;
import com.hkare.hkare_backend.model.*;
import com.hkare.hkare_backend.repository.*;
import com.hkare.hkare_backend.service.DoctorService;
import com.hkare.hkare_backend.service.IDGeneratorService;
import com.hkare.hkare_backend.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final IDGeneratorService idGeneratorService;
    private final PasswordService passwordService;

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<DoctorResponse> getAllDoctorResponses() {
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            return doctors.stream()
                    .map(doctor -> {
                        try {
                            return DoctorResponse.fromDoctor(doctor);
                        } catch (Exception e) {
                            System.err.println("Error mapping doctor to response: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(response -> response != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all doctor responses: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Optional<Doctor> getDoctorById(String doctorId) {
        return doctorRepository.findByDoctorId(doctorId);
    }

    @Override
    public Optional<DoctorResponse> getDoctorResponseById(String doctorId) {
        return doctorRepository.findByDoctorId(doctorId)
                .map(DoctorResponse::fromDoctor);
    }
    
    @Override
    @Transactional
    public RegistrationResponse createDoctor(DoctorRegistrationRequest request) {
        try {
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return RegistrationResponse.builder()
                        .success(false)
                        .message("Email already exists")
                        .build();
            }
            
            // Create user
            Users user = new Users();
            user.setEmail(request.getEmail());
            user.setPassword(passwordService.encodePassword(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            user.setDateOfBirth(request.getDateOfBirth() != null ? LocalDateTime.parse(request.getDateOfBirth()) : null);
            user.setGender(request.getGender() != null ? Users.Gender.valueOf(request.getGender()) : null);
            user.setUserType(Users.UserType.DOCTOR);
            user.setActive(true);
            
            Users savedUser = userRepository.save(user);
            
            // Create doctor
            Doctor doctor = new Doctor();
            doctor.setDoctorId(idGeneratorService.generateDoctorId());
            doctor.setUser(savedUser);
            doctor.setFirstName(request.getFirstName());
            doctor.setLastName(request.getLastName());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setQualification(request.getQualification());
            doctor.setExperienceYears(request.getExperienceYears());
            doctor.setLicenseNumber(request.getLicenseNumber());
            doctor.setConsultationFee(request.getConsultationFee());
            doctor.setBio(request.getBio());
            
            // Link to department if provided
            if (request.getDepartmentId() != null) {
                departmentRepository.findById(request.getDepartmentId())
                        .ifPresent(doctor::setDepartment);
            }
            
            Doctor savedDoctor = doctorRepository.save(doctor);
            
            return RegistrationResponse.builder()
                    .success(true)
                    .message("Doctor registered successfully")
                    .roleId(savedDoctor.getDoctorId())
                    .build();
        } catch (Exception e) {
            System.err.println("Error creating doctor: " + e.getMessage());
            e.printStackTrace();
            return RegistrationResponse.builder()
                    .success(false)
                    .message("Error creating doctor: " + e.getMessage())
                    .build();
        }
    }
    
    @Override
    @Transactional
    public DoctorResponse updateDoctor(String doctorId, DoctorRegistrationRequest request) {
        try {
            Doctor doctor = doctorRepository.findByDoctorId(doctorId)
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));
            
            // Update doctor fields
            doctor.setFirstName(request.getFirstName());
            doctor.setLastName(request.getLastName());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setQualification(request.getQualification());
            doctor.setExperienceYears(request.getExperienceYears());
            doctor.setLicenseNumber(request.getLicenseNumber());
            doctor.setConsultationFee(request.getConsultationFee());
            doctor.setBio(request.getBio());
            
            // Update department if provided
            if (request.getDepartmentId() != null) {
                Department department = departmentRepository.findById(request.getDepartmentId())
                        .orElse(null);
                doctor.setDepartment(department);
            } else {
                doctor.setDepartment(null);
            }
            
            // Update user fields
            Users user = doctor.getUser();
            user.setEmail(request.getEmail());
            if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
            if (request.getAddress() != null) user.setAddress(request.getAddress());
            if (request.getDateOfBirth() != null) {
                user.setDateOfBirth(LocalDateTime.parse(request.getDateOfBirth()));
            }
            if (request.getGender() != null) {
                user.setGender(Users.Gender.valueOf(request.getGender()));
            }
            
            userRepository.save(user);
            Doctor updatedDoctor = doctorRepository.save(doctor);
            
            return DoctorResponse.fromDoctor(updatedDoctor);
        } catch (Exception e) {
            System.err.println("Error updating doctor: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error updating doctor: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public boolean deleteDoctor(String doctorId) {
        try {
            Optional<Doctor> doctorOpt = doctorRepository.findByDoctorId(doctorId);
            if (doctorOpt.isPresent()) {
                Doctor doctor = doctorOpt.get();
                
                // 1. Remove doctor from department head position if they are a head
                Department department = doctor.getDepartment();
                if (department != null && department.getHeadDoctor() != null 
                    && department.getHeadDoctor().getDoctorId().equals(doctorId)) {
                    department.setHeadDoctor(null);
                    departmentRepository.save(department);
                }
                
                // 2. Remove doctor from patients' primary doctor
                List<Patient> patients = patientRepository.findByPrimaryDoctor(doctor);
                for (Patient patient : patients) {
                    patient.setPrimaryDoctor(null);
                    patientRepository.save(patient);
                }
                
                // 3. Update appointments to remove doctor reference
                List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
                for (Appointment appointment : appointments) {
                    appointment.setDoctor(null);
                    appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
                    appointmentRepository.save(appointment);
                }
                
                // 4. Update medical records to remove doctor reference
                List<MedicalRecord> medicalRecords = medicalRecordRepository.findByDoctor(doctor);
                for (MedicalRecord record : medicalRecords) {
                    record.setDoctor(null);
                    medicalRecordRepository.save(record);
                }
                
                // 5. Update prescriptions to remove doctor reference
                List<Prescription> prescriptions = prescriptionRepository.findByDoctor(doctor);
                for (Prescription prescription : prescriptions) {
                    prescription.setDoctor(null);
                    prescription.setStatus(Prescription.PrescriptionStatus.CANCELLED);
                    prescriptionRepository.save(prescription);
                }
                
                // 6. Delete the doctor
                doctorRepository.delete(doctor);
                
                // 7. Delete the associated user
                Users user = doctor.getUser();
                if (user != null) {
                    userRepository.delete(user);
                }
                
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting doctor: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error deleting doctor: " + e.getMessage());
        }
    }
} 