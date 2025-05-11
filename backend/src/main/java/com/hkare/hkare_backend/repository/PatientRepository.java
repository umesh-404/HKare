package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.model.Users;
import com.hkare.hkare_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByUser(Users user);
    Optional<Patient> findByPatientId(String patientId);
    boolean existsByPatientId(String patientId);
    List<Patient> findByPrimaryDoctor(Doctor doctor);
} 