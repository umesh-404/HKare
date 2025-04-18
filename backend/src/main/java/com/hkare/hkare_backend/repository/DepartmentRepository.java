package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
} 