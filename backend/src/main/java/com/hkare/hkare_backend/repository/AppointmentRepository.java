package com.hkare.hkare_backend.repository;

import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);
    List<Appointment> findByPatientAndAppointmentDate(Patient patient, LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= ?1 AND a.appointmentDate <= ?2")
    List<Appointment> findAppointmentsBetweenDates(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.doctorId = ?1 AND a.appointmentDate >= ?2 AND a.appointmentDate <= ?3")
    List<Appointment> findAppointmentsByDoctorBetweenDates(String doctorId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = ?1 AND a.appointmentDate >= ?2 AND a.appointmentDate <= ?3")
    List<Appointment> findAppointmentsByPatientBetweenDates(String patientId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = ?1")
    long countAppointmentsByDate(LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = ?1 AND a.status = ?2")
    long countAppointmentsByDateAndStatus(LocalDate date, Appointment.AppointmentStatus status);
} 