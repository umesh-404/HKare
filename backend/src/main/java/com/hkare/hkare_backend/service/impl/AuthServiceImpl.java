package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.*;
import com.hkare.hkare_backend.model.*;
import com.hkare.hkare_backend.repository.*;
import com.hkare.hkare_backend.service.AuthService;
import com.hkare.hkare_backend.service.IDGeneratorService;
import com.hkare.hkare_backend.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final IDGeneratorService idGeneratorService;
    private final PasswordService passwordService;
    
    @Override
    public LoginResponse loginDoctor(LoginRequest request) {
        // Try to find doctor by ID
        Optional<Doctor> doctorOpt = doctorRepository.findByDoctorId(request.getIdentifier());
        
        // If not found by ID, try to find by email
        if (doctorOpt.isEmpty()) {
            Optional<Users> userOpt = userRepository.findByEmail(request.getIdentifier());
            if (userOpt.isPresent() && userOpt.get().getUserType() == Users.UserType.DOCTOR) {
                // Find the doctor linked to this user
                doctorOpt = doctorRepository.findByUser(userOpt.get());
            }
        }
        
        if (doctorOpt.isEmpty()) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Doctor not found with provided credentials")
                    .build();
        }
        
        Doctor doctor = doctorOpt.get();
        Users user = doctor.getUser();
        
        // Verify password
        if (!passwordService.verifyPassword(request.getPassword(), user.getPassword())) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Invalid credentials")
                    .build();
        }
        
        return LoginResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(user.getEmail())
                .userType(Users.UserType.DOCTOR)
                .isAuthenticated(true)
                .message("Login successful")
                .build();
    }
    
    @Override
    @Transactional
    public RegistrationResponse registerDoctor(DoctorRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return RegistrationResponse.builder()
                    .success(false)
                    .message("Email already in use")
                    .build();
        }
        
        // Create user entity
        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setPassword(passwordService.encodePassword(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setDateOfBirth(request.getDateOfBirthAsLocalDateTime());
        user.setGender(request.getGenderAsEnum());
        user.setUserType(Users.UserType.DOCTOR);
        
        // Save user
        user = userRepository.save(user);
        
        // Generate doctor ID
        String doctorId = idGeneratorService.generateDoctorId();
        while (doctorRepository.existsByDoctorId(doctorId)) {
            doctorId = idGeneratorService.generateDoctorId();
        }
        
        // Create doctor entity
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        doctor.setUser(user);
        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setBio(request.getBio());
        
        // Set department if provided
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(doctor::setDepartment);
        }
        
        // Save doctor
        doctor = doctorRepository.save(doctor);
        
        return RegistrationResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(doctor.getDoctorId())
                .email(user.getEmail())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .userType(Users.UserType.DOCTOR)
                .success(true)
                .message("Doctor registered successfully")
                .build();
    }
    
    @Override
    public LoginResponse loginPatient(LoginRequest request) {
        // Try to find patient by ID
        Optional<Patient> patientOpt = patientRepository.findByPatientId(request.getIdentifier());
        
        // If not found by ID, try to find by email
        if (patientOpt.isEmpty()) {
            Optional<Users> userOpt = userRepository.findByEmail(request.getIdentifier());
            if (userOpt.isPresent() && userOpt.get().getUserType() == Users.UserType.PATIENT) {
                // Find the patient linked to this user
                patientOpt = patientRepository.findByUser(userOpt.get());
            }
        }
        
        if (patientOpt.isEmpty()) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Patient not found with provided credentials")
                    .build();
        }
        
        Patient patient = patientOpt.get();
        Users user = patient.getUser();
        
        // Verify password
        if (!passwordService.verifyPassword(request.getPassword(), user.getPassword())) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Invalid credentials")
                    .build();
        }
        
        return LoginResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(patient.getPatientId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(user.getEmail())
                .userType(Users.UserType.PATIENT)
                .isAuthenticated(true)
                .message("Login successful")
                .build();
    }
    
    @Override
    @Transactional
    public RegistrationResponse registerPatient(PatientRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return RegistrationResponse.builder()
                    .success(false)
                    .message("Email already in use")
                    .build();
        }
        
        // Create user entity
        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setPassword(passwordService.encodePassword(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        user.setUserType(Users.UserType.PATIENT);
        
        // Save user
        user = userRepository.save(user);
        
        // Generate patient ID
        String patientId = idGeneratorService.generatePatientId();
        while (patientRepository.existsByPatientId(patientId)) {
            patientId = idGeneratorService.generatePatientId();
        }
        
        // Create patient entity
        Patient patient = new Patient();
        patient.setPatientId(patientId);
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
        
        // Set primary doctor if provided
        if (request.getPrimaryDoctorId() != null) {
            doctorRepository.findByDoctorId(request.getPrimaryDoctorId())
                    .ifPresent(patient::setPrimaryDoctor);
        }
        
        // Save patient
        patient = patientRepository.save(patient);
        
        return RegistrationResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(patient.getPatientId())
                .email(user.getEmail())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .userType(Users.UserType.PATIENT)
                .success(true)
                .message("Patient registered successfully")
                .build();
    }
    
    @Override
    public LoginResponse loginStaff(LoginRequest request) {
        // Try to find staff by ID
        Optional<Staff> staffOpt = staffRepository.findByStaffId(request.getIdentifier());
        
        // If not found by ID, try to find by email
        if (staffOpt.isEmpty()) {
            Optional<Users> userOpt = userRepository.findByEmail(request.getIdentifier());
            if (userOpt.isPresent() && (userOpt.get().getUserType() == Users.UserType.STAFF || 
                                         userOpt.get().getUserType() == Users.UserType.ADMIN)) {
                // Find the staff linked to this user
                staffOpt = staffRepository.findByUser(userOpt.get());
            }
        }
        
        if (staffOpt.isEmpty()) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Staff not found with provided credentials")
                    .build();
        }
        
        Staff staff = staffOpt.get();
        Users user = staff.getUser();
        
        // Verify password
        if (!passwordService.verifyPassword(request.getPassword(), user.getPassword())) {
            return LoginResponse.builder()
                    .isAuthenticated(false)
                    .message("Invalid credentials")
                    .build();
        }
        
        Users.UserType userType = staff.isAdmin() ? Users.UserType.ADMIN : Users.UserType.STAFF;
        
        return LoginResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(staff.getStaffId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(user.getEmail())
                .userType(userType)
                .isAuthenticated(true)
                .message("Login successful")
                .build();
    }
    
    @Override
    @Transactional
    public RegistrationResponse registerStaff(StaffRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return RegistrationResponse.builder()
                    .success(false)
                    .message("Email already in use")
                    .build();
        }
        
        // Create user entity
        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setPassword(passwordService.encodePassword(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setDateOfBirth(request.getDateOfBirthAsLocalDateTime());
        user.setGender(request.getGenderAsEnum());
        user.setUserType(request.isAdmin() ? Users.UserType.ADMIN : Users.UserType.STAFF);
        
        // Save user
        user = userRepository.save(user);
        
        // Generate ID based on role
        String staffId;
        if (request.isAdmin()) {
            staffId = idGeneratorService.generateAdminId();
            while (staffRepository.existsByStaffId(staffId)) {
                staffId = idGeneratorService.generateAdminId();
            }
        } else {
            staffId = idGeneratorService.generateStaffId();
            while (staffRepository.existsByStaffId(staffId)) {
                staffId = idGeneratorService.generateStaffId();
            }
        }
        
        // Create staff entity
        Staff staff = new Staff();
        staff.setStaffId(staffId);
        staff.setUser(user);
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setPosition(request.getPosition());
        staff.setHireDate(request.getHireDateAsLocalDate());
        
        // Set department if provided
        if (request.getDepartmentId() != null) {
            Long departmentId = request.getDepartmentIdAsLong();
            if (departmentId != null) {
                departmentRepository.findById(departmentId)
                        .ifPresent(staff::setDepartment);
            }
        }
        
        // Save staff
        staff = staffRepository.save(staff);
        
        return RegistrationResponse.builder()
                .userId(user.getUserId().toString())
                .roleId(staff.getStaffId())
                .email(user.getEmail())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .userType(user.getUserType())
                .success(true)
                .message((request.isAdmin() ? "Admin" : "Staff") + " registered successfully")
                .build();
    }
} 