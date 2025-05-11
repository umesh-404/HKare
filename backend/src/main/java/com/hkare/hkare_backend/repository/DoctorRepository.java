package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.Users;
import com.hkare.hkare_backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    Optional<Doctor> findByUser(Users user);
    Optional<Doctor> findByDoctorId(String doctorId);
    boolean existsByDoctorId(String doctorId);
    List<Doctor> findAllByDepartment(Department department);
} 