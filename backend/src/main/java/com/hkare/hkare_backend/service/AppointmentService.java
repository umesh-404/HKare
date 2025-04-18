package com.hkare.hkare_backend.service;

import com.hkare.hkare_backend.dto.AppointmentRequest;
import com.hkare.hkare_backend.dto.AppointmentResponse;
import com.hkare.hkare_backend.model.Appointment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {
    /**
     * Create a new appointment
     *
     * @param request Appointment data
     * @return Created appointment response
     */
    AppointmentResponse createAppointment(AppointmentRequest request);
    
    /**
     * Update an existing appointment
     *
     * @param appointmentId Appointment ID
     * @param request Updated appointment data
     * @return Updated appointment response
     */
    AppointmentResponse updateAppointment(Long appointmentId, AppointmentRequest request);
    
    /**
     * Get appointment by ID
     *
     * @param appointmentId Appointment ID
     * @return Optional containing appointment if found
     */
    Optional<AppointmentResponse> getAppointmentById(Long appointmentId);
    
    /**
     * Delete appointment by ID
     *
     * @param appointmentId Appointment ID
     * @return true if deleted successfully, false otherwise
     */
    boolean deleteAppointment(Long appointmentId);
    
    /**
     * Get all appointments
     *
     * @return List of all appointments
     */
    List<AppointmentResponse> getAllAppointments();
    
    /**
     * Get appointments for a specific doctor
     *
     * @param doctorId Doctor ID
     * @return List of appointments for the doctor
     */
    List<AppointmentResponse> getAppointmentsByDoctor(String doctorId);
    
    /**
     * Get appointments for a specific patient
     *
     * @param patientId Patient ID
     * @return List of appointments for the patient
     */
    List<AppointmentResponse> getAppointmentsByPatient(String patientId);
    
    /**
     * Get appointments for a specific date
     *
     * @param date Appointment date
     * @return List of appointments for the date
     */
    List<AppointmentResponse> getAppointmentsByDate(LocalDate date);
    
    /**
     * Get appointments between two dates
     *
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of appointments between the dates
     */
    List<AppointmentResponse> getAppointmentsBetweenDates(LocalDate startDate, LocalDate endDate);
    
    /**
     * Get appointments by status
     *
     * @param status Appointment status
     * @return List of appointments with the specified status
     */
    List<AppointmentResponse> getAppointmentsByStatus(Appointment.AppointmentStatus status);
    
    /**
     * Update appointment status
     *
     * @param appointmentId Appointment ID
     * @param status New status
     * @return Updated appointment response
     */
    AppointmentResponse updateAppointmentStatus(Long appointmentId, Appointment.AppointmentStatus status);
    
    /**
     * Get count of today's appointments
     *
     * @return Number of appointments scheduled for today
     */
    long getTodayAppointmentsCount();
    
    /**
     * Get count of appointments for a specific day
     *
     * @param date Date to count appointments for
     * @return Number of appointments for the date
     */
    long getAppointmentsCountByDate(LocalDate date);
} 