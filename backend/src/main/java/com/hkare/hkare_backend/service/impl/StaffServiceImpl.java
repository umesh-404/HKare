package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.model.Staff;
import com.hkare.hkare_backend.model.Users;
import com.hkare.hkare_backend.model.Users.Gender;
import com.hkare.hkare_backend.repository.DepartmentRepository;
import com.hkare.hkare_backend.repository.StaffRepository;
import com.hkare.hkare_backend.repository.UserRepository;
import com.hkare.hkare_backend.service.IDGeneratorService;
import com.hkare.hkare_backend.service.PasswordService;
import com.hkare.hkare_backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final IDGeneratorService idGeneratorService;
    private final PasswordService passwordService;
    
    @Override
    public Optional<Staff> getStaffById(String staffId) {
        log.info("Fetching staff by ID: {}", staffId);
        return staffRepository.findByStaffId(staffId);
    }
    
    @Override
    public Optional<StaffProfileResponse> getStaffProfileById(String staffId) {
        log.info("Fetching staff profile by ID: {}", staffId);
        return staffRepository.findByStaffId(staffId)
                .map(staff -> {
                    log.info("Staff found: {} {}", staff.getFirstName(), staff.getLastName());
                    return StaffProfileResponse.fromStaff(staff);
                });
    }
    
    @Override
    public List<Staff> getAllStaff() {
        log.info("Fetching all staff members");
        List<Staff> staff = staffRepository.findAll();
        log.info("Retrieved {} staff members", staff.size());
        return staff;
    }
    
    @Override
    public List<StaffProfileResponse> getAllStaffProfiles() {
        log.info("Fetching all staff profiles");
        List<StaffProfileResponse> profiles = staffRepository.findAll()
                .stream()
                .map(StaffProfileResponse::fromStaff)
                .collect(Collectors.toList());
        log.info("Retrieved {} staff profiles", profiles.size());
        return profiles;
    }
    
    @Override
    @Transactional
    public Staff updateStaffProfile(String staffId, StaffProfileUpdateRequest updateRequest) {
        log.info("Updating staff profile for staffId: {}", staffId);
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> {
                    log.error("Staff not found with ID: {}", staffId);
                    return new NoSuchElementException("Staff not found with ID: " + staffId);
                });
        
        updateStaffFields(staff, updateRequest);
        
        staff = staffRepository.save(staff);
        log.info("Staff profile updated successfully for staffId: {}", staffId);
        return staff;
    }
    
    @Override
    @Transactional
    public StaffProfileResponse updateStaffProfileWithResponse(String staffId, StaffProfileUpdateRequest updateRequest) {
        log.info("Updating staff profile with response for staffId: {}", staffId);
        Staff staff = updateStaffProfile(staffId, updateRequest);
        return StaffProfileResponse.fromStaff(staff);
    }
    
    @Override
    @Transactional
    public RegistrationResponse createStaff(StaffRegistrationRequest request) {
        log.info("Creating new staff member: {} {}", request.getFirstName(), request.getLastName());
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Email already in use: {}", request.getEmail());
            return RegistrationResponse.builder()
                    .success(false)
                    .message("Email already in use")
                    .build();
        }
        
        try {
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
            log.debug("Saving user entity for email: {}", request.getEmail());
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
            log.debug("Generated staff ID: {}", staffId);
            
            // Create staff entity
            Staff staff = new Staff();
            staff.setStaffId(staffId);
            staff.setUser(user);
            staff.setFirstName(request.getFirstName());
            staff.setLastName(request.getLastName());
            staff.setPosition(request.getPosition());
            staff.setHireDate(request.getHireDateAsLocalDate());
            
            // Set department if provided
            Long departmentId = request.getDepartmentIdAsLong();
            if (departmentId != null) {
                departmentRepository.findById(departmentId)
                        .ifPresent(department -> {
                            staff.setDepartment(department);
                            log.debug("Set department for staff: {} ({})", department.getName(), department.getDepartmentId());
                        });
            }
            
            // Save staff
            log.debug("Saving staff entity");
            Staff savedStaff = staffRepository.save(staff);
            
            log.info("Staff created successfully with ID: {}", savedStaff.getStaffId());
            return RegistrationResponse.builder()
                    .userId(user.getUserId().toString())
                    .roleId(savedStaff.getStaffId())
                    .email(user.getEmail())
                    .firstName(savedStaff.getFirstName())
                    .lastName(savedStaff.getLastName())
                    .userType(user.getUserType())
                    .success(true)
                    .message((request.isAdmin() ? "Admin" : "Staff") + " created successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error creating staff: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @Override
    @Transactional
    public boolean deleteStaff(String staffId) {
        log.info("Deleting staff with ID: {}", staffId);
        
        Optional<Staff> staffOpt = staffRepository.findByStaffId(staffId);
        
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            Users user = staff.getUser();
            
            log.debug("Deleting staff entity with ID: {}", staffId);
            // Delete staff first (due to foreign key constraint)
            staffRepository.delete(staff);
            
            log.debug("Deleting associated user with ID: {}", user.getUserId());
            // Then delete associated user
            userRepository.delete(user);
            
            log.info("Staff and associated user deleted successfully");
            return true;
        }
        
        log.warn("Staff not found with ID: {}", staffId);
        return false;
    }
    
    private void updateStaffFields(Staff staff, StaffProfileUpdateRequest updateRequest) {
        log.debug("Updating staff fields for: {}", staff.getStaffId());
        
        // Update basic staff information
        if (updateRequest.getFirstName() != null) {
            staff.setFirstName(updateRequest.getFirstName());
            log.debug("Updated firstName to: {}", updateRequest.getFirstName());
        }
        
        if (updateRequest.getLastName() != null) {
            staff.setLastName(updateRequest.getLastName());
            log.debug("Updated lastName to: {}", updateRequest.getLastName());
        }
        
        if (updateRequest.getPosition() != null) {
            staff.setPosition(updateRequest.getPosition());
            log.debug("Updated position to: {}", updateRequest.getPosition());
        }
        
        if (updateRequest.getHireDate() != null) {
            LocalDate hireDate = updateRequest.getHireDateAsLocalDate();
            if (hireDate != null) {
                staff.setHireDate(hireDate);
                log.debug("Updated hireDate to: {}", hireDate);
            }
        }
        
        // Update department if provided
        if (updateRequest.getDepartmentId() != null) {
            Long departmentId = updateRequest.getDepartmentIdAsLong();
            if (departmentId != null) {
                departmentRepository.findById(departmentId)
                        .ifPresent(department -> {
                            staff.setDepartment(department);
                            log.debug("Updated department to: {} ({})", department.getName(), department.getDepartmentId());
                        });
            }
        }
        
        // Update user information if provided
        Users user = staff.getUser();
        
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
            log.debug("Updated phoneNumber to: {}", updateRequest.getPhoneNumber());
        }
        
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
            log.debug("Updated address to: {}", updateRequest.getAddress());
        }
        
        if (updateRequest.getDateOfBirth() != null) {
            LocalDateTime dateOfBirth = updateRequest.getDateOfBirthAsLocalDateTime();
            if (dateOfBirth != null) {
                user.setDateOfBirth(dateOfBirth);
                log.debug("Updated dateOfBirth to: {}", dateOfBirth);
            }
        }
        
        if (updateRequest.getGender() != null) {
            Gender gender = updateRequest.getGenderAsEnum();
            if (gender != null) {
                user.setGender(gender);
                log.debug("Updated gender to: {}", gender);
            }
        }
        
        // Update user type if admin status is provided
        if (updateRequest.getIsAdmin() != null) {
            Users.UserType userType = updateRequest.getIsAdmin() ? Users.UserType.ADMIN : Users.UserType.STAFF;
            user.setUserType(userType);
            log.debug("Updated userType to: {}", userType);
        }
        
        // Save the updated user
        userRepository.save(user);
        log.debug("User information updated successfully");
    }
} 