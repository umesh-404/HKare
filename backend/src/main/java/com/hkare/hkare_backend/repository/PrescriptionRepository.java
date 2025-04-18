package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.model.Pharmacy;
import com.hkare.hkare_backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient(Patient patient);
    
    List<Prescription> findByDoctor(Doctor doctor);
    
    List<Prescription> findByPharmacy(Pharmacy pharmacy);
    
    List<Prescription> findByStatus(Prescription.PrescriptionStatus status);
    
    List<Prescription> findByPatientOrderByPrescriptionDateDesc(Patient patient);
    
    List<Prescription> findByDoctorOrderByPrescriptionDateDesc(Doctor doctor);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = ?1 ORDER BY p.prescriptionDate DESC")
    List<Prescription> findPatientPrescriptions(String patientId);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.doctorId = ?1 ORDER BY p.prescriptionDate DESC")
    List<Prescription> findDoctorPrescriptions(String doctorId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = ?1 AND p.status = ?2 ORDER BY p.prescriptionDate DESC")
    List<Prescription> findPatientPrescriptionsByStatus(String patientId, Prescription.PrescriptionStatus status);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.doctorId = ?1 AND p.status = ?2 ORDER BY p.prescriptionDate DESC")
    List<Prescription> findDoctorPrescriptionsByStatus(String doctorId, Prescription.PrescriptionStatus status);
    
    @Query("SELECT p FROM Prescription p WHERE p.prescriptionDate BETWEEN ?1 AND ?2")
    List<Prescription> findPrescriptionsBetweenDates(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = ?1 AND p.prescriptionDate BETWEEN ?2 AND ?3")
    List<Prescription> findPatientPrescriptionsBetweenDates(String patientId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.doctorId = ?1 AND p.prescriptionDate BETWEEN ?2 AND ?3")
    List<Prescription> findDoctorPrescriptionsBetweenDates(String doctorId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.status = 'ACTIVE' AND p.expiryDate < ?1")
    List<Prescription> findExpiredPrescriptions(LocalDate currentDate);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctor.doctorId = ?1 AND p.prescriptionDate = ?2")
    long countDoctorPrescriptionsByDate(String doctorId, LocalDate date);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.patient.patientId = ?1 AND p.prescriptionDate BETWEEN ?2 AND ?3")
    long countPatientPrescriptionsInPeriod(String patientId, LocalDate startDate, LocalDate endDate);
} 