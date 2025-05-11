package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.MedicalRecord;
import com.hkare.hkare_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient(Patient patient);
    List<MedicalRecord> findByDoctor(Doctor doctor);
    List<MedicalRecord> findByAppointment(Appointment appointment);
    List<MedicalRecord> findByRecordType(MedicalRecord.RecordType recordType);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.recordDate BETWEEN ?1 AND ?2")
    List<MedicalRecord> findRecordsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.patientId = ?1 AND mr.recordDate BETWEEN ?2 AND ?3")
    List<MedicalRecord> findPatientRecordsBetweenDates(String patientId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor.doctorId = ?1 AND mr.recordDate BETWEEN ?2 AND ?3")
    List<MedicalRecord> findDoctorRecordsBetweenDates(String doctorId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<MedicalRecord> findByPatientOrderByRecordDateDesc(Patient patient);
    List<MedicalRecord> findByDoctorOrderByRecordDateDesc(Doctor doctor);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.patientId = ?1 AND mr.recordType = ?2 ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findPatientRecordsByType(String patientId, MedicalRecord.RecordType recordType);
    
    @Query("SELECT DISTINCT mr.diagnosis FROM MedicalRecord mr WHERE mr.patient.patientId = ?1")
    List<String> findPatientDiagnoses(String patientId);
    
    @Query(value = "SELECT record_type, COUNT(*) as count FROM medical_records WHERE patient_id = ?1 GROUP BY record_type", nativeQuery = true)
    List<Object[]> countPatientRecordsByType(String patientId);

    void deleteByAppointment_AppointmentId(Long appointmentId);
} 