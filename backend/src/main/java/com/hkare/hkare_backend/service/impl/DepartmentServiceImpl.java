package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.DepartmentResponse;
import com.hkare.hkare_backend.model.Department;
import com.hkare.hkare_backend.repository.DepartmentRepository;
import com.hkare.hkare_backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    
    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    @Override
    public List<DepartmentResponse> getAllDepartmentResponses() {
        return departmentRepository.findAll()
                .stream()
                .map(DepartmentResponse::fromDepartment)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<Department> getDepartmentById(Long departmentId) {
        return departmentRepository.findById(departmentId);
    }
    
    @Override
    public Optional<DepartmentResponse> getDepartmentResponseById(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .map(DepartmentResponse::fromDepartment);
    }
    
    @Override
    @Transactional
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }
    
    @Override
    @Transactional
    public Department updateDepartment(Long departmentId, Department departmentDetails) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new NoSuchElementException("Department not found with id: " + departmentId));
        
        // Update fields
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        
        // Update head doctor if provided
        if (departmentDetails.getHeadDoctor() != null) {
            department.setHeadDoctor(departmentDetails.getHeadDoctor());
        }
        
        return departmentRepository.save(department);
    }
    
    @Override
    @Transactional
    public boolean deleteDepartment(Long departmentId) {
        if (departmentRepository.existsById(departmentId)) {
            departmentRepository.deleteById(departmentId);
            return true;
        }
        return false;
    }
} 