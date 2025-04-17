package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.service.StaffService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping({"/staff", "/api/staff"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {
    private final StaffService staffService;
    
    @PostConstruct
    public void init() {
        System.out.println("StaffController initialized with mappings: /staff and /api/staff");
    }
    
    @GetMapping("/{staffId}")
    public ResponseEntity<?> getStaffDetails(@PathVariable String staffId) {
        System.out.println("GET request received for staff ID: " + staffId);
        try {
            return staffService.getStaffProfileById(staffId)
                    .map(response -> {
                        System.out.println("Staff found: " + response.getFirstName() + " " + response.getLastName());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error retrieving staff details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving staff: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllStaff() {
        System.out.println("GET request received for all staff members");
        try {
            List<StaffProfileResponse> staffProfiles = staffService.getAllStaffProfiles();
            System.out.println("Retrieved " + staffProfiles.size() + " staff members");
            return ResponseEntity.ok(staffProfiles);
        } catch (Exception e) {
            System.err.println("Error retrieving all staff: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    @PutMapping("/{staffId}")
    public ResponseEntity<?> updateStaffProfile(@PathVariable String staffId, @RequestBody StaffProfileUpdateRequest updateRequest) {
        System.out.println("PUT request received for staff ID: " + staffId);
        try {
            StaffProfileResponse updatedProfile = staffService.updateStaffProfileWithResponse(staffId, updateRequest);
            System.out.println("Staff updated successfully: " + updatedProfile.getFirstName() + " " + updatedProfile.getLastName());
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            System.err.println("Error updating staff: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating staff: " + e.getMessage());
        }
    }
    
    /**
     * Admin privilege: Create a new staff member
     */
    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody StaffRegistrationRequest registrationRequest) {
        System.out.println("POST request received to create new staff member: " + registrationRequest.getFirstName() + " " + registrationRequest.getLastName());
        try {
            RegistrationResponse response = staffService.createStaff(registrationRequest);
            if (response.isSuccess()) {
                System.out.println("Staff created successfully with ID: " + response.getRoleId());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                System.err.println("Failed to create staff: " + response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Error creating staff: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error creating staff: " + e.getMessage());
        }
    }
    
    /**
     * Admin privilege: Delete a staff member
     */
    @DeleteMapping("/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable String staffId) {
        System.out.println("DELETE request received for staff ID: " + staffId);
        try {
            boolean deleted = staffService.deleteStaff(staffId);
            if (deleted) {
                System.out.println("Staff deleted successfully: " + staffId);
                return ResponseEntity.ok().build();
            } else {
                System.err.println("Staff not found: " + staffId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting staff: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting staff: " + e.getMessage());
        }
    }
} 