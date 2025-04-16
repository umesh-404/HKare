package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.RegistrationResponse;
import com.hkare.hkare_backend.dto.StaffProfileResponse;
import com.hkare.hkare_backend.dto.StaffProfileUpdateRequest;
import com.hkare.hkare_backend.dto.StaffRegistrationRequest;
import com.hkare.hkare_backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {
    private final StaffService staffService;
    
    @GetMapping("/{staffId}")
    public ResponseEntity<?> getStaffDetails(@PathVariable String staffId) {
        return staffService.getStaffProfileById(staffId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<?> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaffProfiles());
    }
    
    @PutMapping("/{staffId}")
    public ResponseEntity<?> updateStaffProfile(@PathVariable String staffId, @RequestBody StaffProfileUpdateRequest updateRequest) {
        try {
            StaffProfileResponse updatedProfile = staffService.updateStaffProfileWithResponse(staffId, updateRequest);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Admin privilege: Create a new staff member
     */
    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody StaffRegistrationRequest registrationRequest) {
        try {
            RegistrationResponse response = staffService.createStaff(registrationRequest);
            if (response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error creating staff: " + e.getMessage());
        }
    }
    
    /**
     * Admin privilege: Delete a staff member
     */
    @DeleteMapping("/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable String staffId) {
        boolean deleted = staffService.deleteStaff(staffId);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 