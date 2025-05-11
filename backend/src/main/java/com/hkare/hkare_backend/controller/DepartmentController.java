package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.DepartmentRequest;
import com.hkare.hkare_backend.dto.DepartmentResponse;
import com.hkare.hkare_backend.model.Department;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.service.DepartmentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping({"/departments", "/api/departments"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartmentController {
    private final DepartmentService departmentService;
    private final DoctorRepository doctorRepository;
    
    @PostConstruct
    public void init() {
        System.out.println("DepartmentController initialized with mappings: /departments and /api/departments");
    }
    
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        System.out.println("GET request received at /departments or /api/departments");
        try {
            List<DepartmentResponse> departmentResponses = departmentService.getAllDepartmentResponses();
            System.out.println("Retrieved " + departmentResponses.size() + " departments");
            return ResponseEntity.ok(departmentResponses);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching departments: " + e.getMessage());
            e.printStackTrace();
            // Return an empty list instead of failing
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
    
    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long departmentId) {
        return departmentService.getDepartmentResponseById(departmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentRequest departmentRequest) {
        try {
            Department department = new Department();
            department.setName(departmentRequest.getName());
            department.setDescription(departmentRequest.getDescription());
            
            // Set head doctor if provided
            if (departmentRequest.getHeadDoctorId() != null) {
                Doctor headDoctor = doctorRepository.findByDoctorId(departmentRequest.getHeadDoctorId())
                        .orElse(null);
                department.setHeadDoctor(headDoctor);
            }
            
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(DepartmentResponse.fromDepartment(createdDepartment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating department: " + e.getMessage());
        }
    }
    
    @PutMapping("/{departmentId}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long departmentId, 
                                           @RequestBody DepartmentRequest departmentRequest) {
        try {
            // Create department object with updated fields
            Department departmentUpdate = new Department();
            departmentUpdate.setName(departmentRequest.getName());
            departmentUpdate.setDescription(departmentRequest.getDescription());
            
            // Set head doctor if provided
            if (departmentRequest.getHeadDoctorId() != null) {
                Doctor headDoctor = doctorRepository.findByDoctorId(departmentRequest.getHeadDoctorId())
                        .orElse(null);
                departmentUpdate.setHeadDoctor(headDoctor);
            }
            
            Department updatedDepartment = departmentService.updateDepartment(departmentId, departmentUpdate);
            return ResponseEntity.ok(DepartmentResponse.fromDepartment(updatedDepartment));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating department: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long departmentId) {
        try {
            boolean deleted = departmentService.deleteDepartment(departmentId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Cannot delete department: it is still referenced by other entities.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete department: " + ex.getMessage());
        }
    }
} 