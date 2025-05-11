package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.AppointmentRequest;
import com.hkare.hkare_backend.dto.AppointmentResponse;
import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Department;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.repository.AppointmentRepository;
import com.hkare.hkare_backend.repository.DepartmentRepository;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.repository.MedicalRecordRepository;
import com.hkare.hkare_backend.repository.PatientRepository;
import com.hkare.hkare_backend.service.AppointmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    
    @Override
    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {
        Appointment appointment = mapRequestToEntity(request);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(savedAppointment);
    }
    
    @Override
    @Transactional
    public AppointmentResponse updateAppointment(Long appointmentId, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        
        // Update appointment fields
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
        Department department = request.getDepartmentId() != null ?
                departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new EntityNotFoundException("Department not found with ID: " + request.getDepartmentId())) :
                null;
        
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setDepartment(department);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(request.getStatus());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setAppointmentFee(request.getAppointmentFee());
        appointment.setIsPaid(request.getIsPaid());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(updatedAppointment);
    }
    
    @Override
    public Optional<AppointmentResponse> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .map(this::mapEntityToResponse);
    }
    
    @Override
    @Transactional
    public boolean deleteAppointment(Long appointmentId) {
        try {
            if (appointmentRepository.existsById(appointmentId)) {
                // Delete all medical records related to this appointment first
                medicalRecordRepository.deleteByAppointment_AppointmentId(appointmentId);
                // Now delete the appointment
                appointmentRepository.deleteById(appointmentId);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Error deleting appointment: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getAppointmentsByDoctor(String doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));
        
        return appointmentRepository.findByDoctor(doctor).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getAppointmentsByPatient(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        
        return appointmentRepository.findByPatient(patient).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getAppointmentsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findAppointmentsBetweenDates(startDate, endDate).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AppointmentResponse> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        
        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return mapEntityToResponse(updatedAppointment);
    }
    
    @Override
    public long getTodayAppointmentsCount() {
        return appointmentRepository.countAppointmentsByDate(LocalDate.now());
    }
    
    @Override
    public long getAppointmentsCountByDate(LocalDate date) {
        return appointmentRepository.countAppointmentsByDate(date);
    }
    
    private Appointment mapRequestToEntity(AppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
        
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }
        
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setDepartment(department);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus(request.getStatus() != null ? request.getStatus() : Appointment.AppointmentStatus.SCHEDULED);
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setAppointmentFee(request.getAppointmentFee());
        appointment.setIsPaid(request.getIsPaid() != null ? request.getIsPaid() : false);
        
        return appointment;
    }
    
    private AppointmentResponse mapEntityToResponse(Appointment appointment) {
        // Handle null doctor and patient references gracefully
        String doctorId = null;
        String doctorName = null;
        String doctorSpecialization = null;
        if (appointment.getDoctor() != null) {
            doctorId = appointment.getDoctor().getDoctorId();
            doctorName = "Dr. " + appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName();
            doctorSpecialization = appointment.getDoctor().getSpecialization();
        }
        String patientId = null;
        String patientName = null;
        String patientEmail = null;
        String patientPhone = null;
        if (appointment.getPatient() != null) {
            patientId = appointment.getPatient().getPatientId();
            patientName = appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName();
            if (appointment.getPatient().getUser() != null) {
                patientEmail = appointment.getPatient().getUser().getEmail();
                patientPhone = appointment.getPatient().getUser().getPhoneNumber();
            }
        }
        return AppointmentResponse.builder()
                .appointmentId(appointment.getAppointmentId())
                .patientId(patientId)
                .patientName(patientName)
                .patientEmail(patientEmail)
                .patientPhone(patientPhone)
                .doctorId(doctorId)
                .doctorName(doctorName)
                .doctorSpecialization(doctorSpecialization)
                .departmentId(appointment.getDepartment() != null ? appointment.getDepartment().getDepartmentId() : null)
                .departmentName(appointment.getDepartment() != null ? appointment.getDepartment().getName() : null)
                .appointmentDate(appointment.getAppointmentDate())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .appointmentFee(appointment.getAppointmentFee())
                .isPaid(appointment.getIsPaid())
                .build();
    }
} 