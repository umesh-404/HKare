package com.hkare.hkare_backend.controller;

import com.hkare.hkare_backend.dto.AppointmentRequest;
import com.hkare.hkare_backend.dto.AppointmentResponse;
import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.service.AppointmentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/appointments", "/api/appointments"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {
    private final AppointmentService appointmentService;
    
    @PostConstruct
    public void init() {
        System.out.println("AppointmentController initialized with mappings: /appointments and /api/appointments");
    }
    
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(@RequestBody AppointmentRequest request) {
        System.out.println("POST request to create appointment for patient: " + request.getPatientId() + " with doctor: " + request.getDoctorId());
        try {
            AppointmentResponse response = appointmentService.createAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("Error creating appointment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable Long appointmentId) {
        System.out.println("GET request for appointment ID: " + appointmentId);
        return appointmentService.getAppointmentById(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody AppointmentRequest request) {
        System.out.println("PUT request to update appointment ID: " + appointmentId);
        try {
            AppointmentResponse response = appointmentService.updateAppointment(appointmentId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating appointment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        System.out.println("DELETE request for appointment ID: " + appointmentId);
        boolean deleted = appointmentService.deleteAppointment(appointmentId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        System.out.println("GET request for all appointments");
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDoctor(@PathVariable String doctorId) {
        System.out.println("GET request for appointments of doctor ID: " + doctorId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByPatient(@PathVariable String patientId) {
        System.out.println("GET request for appointments of patient ID: " + patientId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        System.out.println("GET request for appointments on date: " + date);
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        System.out.println("GET request for appointments between: " + startDate + " and " + endDate);
        return ResponseEntity.ok(appointmentService.getAppointmentsBetweenDates(startDate, endDate));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByStatus(@PathVariable Appointment.AppointmentStatus status) {
        System.out.println("GET request for appointments with status: " + status);
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }
    
    @PatchMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> statusUpdate) {
        System.out.println("PATCH request to update status of appointment ID: " + appointmentId);
        try {
            Appointment.AppointmentStatus newStatus = Appointment.AppointmentStatus.valueOf(statusUpdate.get("status"));
            AppointmentResponse response = appointmentService.updateAppointmentStatus(appointmentId, newStatus);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid status provided: " + statusUpdate.get("status"));
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Error updating appointment status: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/count/today")
    public ResponseEntity<Map<String, Long>> getTodayAppointmentsCount() {
        System.out.println("GET request for today's appointments count");
        long count = appointmentService.getTodayAppointmentsCount();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/count/date/{date}")
    public ResponseEntity<Map<String, Long>> getAppointmentsCountByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        System.out.println("GET request for appointments count on date: " + date);
        long count = appointmentService.getAppointmentsCountByDate(date);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
} 