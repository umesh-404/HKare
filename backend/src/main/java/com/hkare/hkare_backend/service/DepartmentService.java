package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.DepartmentResponse;
import com.hkare.hkare_backend.model.Department;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    /**
     * Get all departments
     * @return List of all departments
     */
    List<Department> getAllDepartments();
    
    /**
     * Get all department responses
     * @return List of all department responses
     */
    List<DepartmentResponse> getAllDepartmentResponses();
    
    /**
     * Get department by ID
     * @param departmentId Department ID
     * @return Optional containing department if found
     */
    Optional<Department> getDepartmentById(Long departmentId);
    
    /**
     * Get department response by ID
     * @param departmentId Department ID
     * @return Optional containing department response if found
     */
    Optional<DepartmentResponse> getDepartmentResponseById(Long departmentId);
    
    /**
     * Create a new department
     * @param department Department to create
     * @return Created department
     */
    Department createDepartment(Department department);
    
    /**
     * Update an existing department
     * @param departmentId Department ID
     * @param department Department data to update
     * @return Updated department
     */
    Department updateDepartment(Long departmentId, Department department);
    
    /**
     * Delete a department
     * @param departmentId Department ID
     * @return true if deleted, false otherwise
     */
    boolean deleteDepartment(Long departmentId);
} 