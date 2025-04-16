package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.model.Staff;
import com.hkare.hkare_backend.model.Users;
import com.hkare.hkare_backend.repository.DepartmentRepository;
import com.hkare.hkare_backend.repository.StaffRepository;
import com.hkare.hkare_backend.repository.UserRepository;
import com.hkare.hkare_backend.service.IDGeneratorService;
import com.hkare.hkare_backend.service.PasswordService;
import com.hkare.hkare_backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final IDGeneratorService idGeneratorService;
    private final PasswordService passwordService;
    
    @Override
    public Optional<Staff> getStaffById(String staffId) {
        return staffRepository.findByStaffId(staffId);
    }
    
    @Override
    public Optional<StaffProfileResponse> getStaffProfileById(String staffId) {
        return staffRepository.findByStaffId(staffId)
                .map(StaffProfileResponse::fromStaff);
    }
    
    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
    
    @Override
    public List<StaffProfileResponse> getAllStaffProfiles() {
        return staffRepository.findAll()
                .stream()
                .map(StaffProfileResponse::fromStaff)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Staff updateStaffProfile(String staffId, StaffProfileUpdateRequest updateRequest) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new NoSuchElementException("Staff not found with ID: " + staffId));
        
        updateStaffFields(staff, updateRequest);
        
        return staffRepository.save(staff);
    }
    
    @Override
    @Transactional
    public StaffProfileResponse updateStaffProfileWithResponse(String staffId, StaffProfileUpdateRequest updateRequest) {
        Staff staff = updateStaffProfile(staffId, updateRequest);
        return StaffProfileResponse.fromStaff(staff);
    }
    
    @Override
    @Transactional
    public RegistrationResponse createStaff(StaffRegistrationRequest request) {
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
        staff.setHireDate(request.getHireDate());
        
        // Set department if provided
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(staff::setDepartment);
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
                .message((request.isAdmin() ? "Admin" : "Staff") + " created successfully")
                .build();
    }
    
    @Override
    @Transactional
    public boolean deleteStaff(String staffId) {
        Optional<Staff> staffOpt = staffRepository.findByStaffId(staffId);
        
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            Users user = staff.getUser();
            
            // Delete staff first (due to foreign key constraint)
            staffRepository.delete(staff);
            
            // Then delete associated user
            userRepository.delete(user);
            
            return true;
        }
        
        return false;
    }
    
    private void updateStaffFields(Staff staff, StaffProfileUpdateRequest updateRequest) {
        // Update basic staff information
        if (updateRequest.getFirstName() != null) {
            staff.setFirstName(updateRequest.getFirstName());
        }
        
        if (updateRequest.getLastName() != null) {
            staff.setLastName(updateRequest.getLastName());
        }
        
        if (updateRequest.getPosition() != null) {
            staff.setPosition(updateRequest.getPosition());
        }
        
        if (updateRequest.getHireDate() != null) {
            staff.setHireDate(updateRequest.getHireDate());
        }
        
        // Update department if provided
        if (updateRequest.getDepartmentId() != null) {
            departmentRepository.findById(updateRequest.getDepartmentId())
                    .ifPresent(staff::setDepartment);
        }
        
        // Update user information if provided
        Users user = staff.getUser();
        
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
        }
        
        if (updateRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(updateRequest.getDateOfBirth());
        }
        
        if (updateRequest.getGender() != null) {
            user.setGender(updateRequest.getGender());
        }
    }
} 