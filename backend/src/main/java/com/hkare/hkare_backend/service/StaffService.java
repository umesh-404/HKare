package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.model.Staff;

import java.util.List;
import java.util.Optional;

public interface StaffService {
    /**
     * Get staff by ID
     * @param staffId Staff ID
     * @return Optional containing staff if found
     */
    Optional<Staff> getStaffById(String staffId);
    
    /**
     * Get staff profile by ID
     * @param staffId Staff ID
     * @return Optional containing staff profile response if found
     */
    Optional<StaffProfileResponse> getStaffProfileById(String staffId);
    
    /**
     * Get all staff members
     * @return List of all staff members
     */
    List<Staff> getAllStaff();
    
    /**
     * Get all staff profiles
     * @return List of all staff profile responses
     */
    List<StaffProfileResponse> getAllStaffProfiles();
    
    /**
     * Update staff profile
     * @param staffId Staff ID
     * @param updateRequest Staff profile update request
     * @return Updated staff object
     */
    Staff updateStaffProfile(String staffId, StaffProfileUpdateRequest updateRequest);
    
    /**
     * Update staff profile
     * @param staffId Staff ID
     * @param updateRequest Staff profile update request
     * @return Updated staff profile response
     */
    StaffProfileResponse updateStaffProfileWithResponse(String staffId, StaffProfileUpdateRequest updateRequest);
    
    /**
     * Create new staff member (admin privilege)
     * @param registrationRequest Staff registration request data
     * @return Registration response with created staff details
     */
    RegistrationResponse createStaff(StaffRegistrationRequest registrationRequest);
    
    /**
     * Delete a staff member (admin privilege)
     * @param staffId Staff ID to delete
     * @return true if deleted successfully, false otherwise
     */
    boolean deleteStaff(String staffId);
} 