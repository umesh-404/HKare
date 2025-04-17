package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.service.StaffService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping({"/staff", "/api/staff"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class StaffController {
    private final StaffService staffService;
    
    @PostConstruct
    public void init() {
        log.info("StaffController initialized with mappings: /staff and /api/staff");
    }
    
    /**
     * Get a staff member by ID
     * @param staffId Staff ID
     * @return Staff profile data
     */
    @GetMapping("/{staffId}")
    public ResponseEntity<?> getStaffDetails(@PathVariable String staffId) {
        log.info("GET request received for staff ID: {}", staffId);
        try {
            return staffService.getStaffProfileById(staffId)
                    .map(response -> {
                        log.info("Staff found: {} {}", response.getFirstName(), response.getLastName());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error retrieving staff details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving staff: " + e.getMessage());
        }
    }
    
    /**
     * Get all staff members
     * @return List of all staff profiles
     */
    @GetMapping
    public ResponseEntity<?> getAllStaff() {
        log.info("GET request received for all staff members");
        try {
            List<StaffProfileResponse> staffProfiles = staffService.getAllStaffProfiles();
            log.info("Retrieved {} staff members", staffProfiles.size());
            return ResponseEntity.ok(staffProfiles);
        } catch (Exception e) {
            log.error("Error retrieving all staff: {}", e.getMessage(), e);
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    /**
     * Get all staff profiles
     * @return List of all staff profiles
     */
    @GetMapping("/profiles")
    public ResponseEntity<?> getAllStaffProfiles() {
        log.info("GET request received for all staff profiles");
        try {
            List<StaffProfileResponse> staffProfiles = staffService.getAllStaffProfiles();
            log.info("Retrieved {} staff profiles", staffProfiles.size());
            return ResponseEntity.ok(staffProfiles);
        } catch (Exception e) {
            log.error("Error retrieving all staff profiles: {}", e.getMessage(), e);
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    /**
     * Update a staff member's profile
     * @param staffId Staff ID
     * @param updateRequest Profile update data
     * @return Updated profile
     */
    @PutMapping("/{staffId}")
    public ResponseEntity<?> updateStaffProfile(@PathVariable String staffId, @RequestBody StaffProfileUpdateRequest updateRequest) {
        log.info("PUT request received for staff ID: {}", staffId);
        try {
            StaffProfileResponse updatedProfile = staffService.updateStaffProfileWithResponse(staffId, updateRequest);
            log.info("Staff updated successfully: {} {}", updatedProfile.getFirstName(), updatedProfile.getLastName());
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            log.error("Error updating staff: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating staff: " + e.getMessage());
        }
    }
    
    /**
     * Create a new staff member
     * @param registrationRequest Staff registration data
     * @return Registration response
     */
    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody StaffRegistrationRequest registrationRequest) {
        log.info("POST request received to create new staff member: {} {}", 
                registrationRequest.getFirstName(), registrationRequest.getLastName());
        try {
            RegistrationResponse response = staffService.createStaff(registrationRequest);
            if (response.isSuccess()) {
                log.info("Staff created successfully with ID: {}", response.getRoleId());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                log.warn("Failed to create staff: {}", response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error creating staff: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body("Error creating staff: " + e.getMessage());
        }
    }
    
    /**
     * Create a new staff member (alternate endpoint)
     * @param registrationRequest Staff registration data
     * @return Registration response
     */
    @PostMapping("/create")
    public ResponseEntity<?> createStaffAlternate(@RequestBody StaffRegistrationRequest registrationRequest) {
        log.info("POST request received to create new staff member (alternate endpoint): {} {}", 
                registrationRequest.getFirstName(), registrationRequest.getLastName());
        return createStaff(registrationRequest);
    }
    
    /**
     * Delete a staff member
     * @param staffId Staff ID
     * @return Success/failure response
     */
    @DeleteMapping("/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable String staffId) {
        log.info("DELETE request received for staff ID: {}", staffId);
        try {
            boolean deleted = staffService.deleteStaff(staffId);
            if (deleted) {
                log.info("Staff deleted successfully: {}", staffId);
                return ResponseEntity.ok().build();
            } else {
                log.warn("Staff not found: {}", staffId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deleting staff: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting staff: " + e.getMessage());
        }
    }
} 