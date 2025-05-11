package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.PaymentRequest;
import com.hkare.hkare_backend.dto.PaymentResponse;
import com.hkare.hkare_backend.model.Appointment;
import com.hkare.hkare_backend.model.Patient;
import com.hkare.hkare_backend.model.Payment;
import com.hkare.hkare_backend.model.Staff;
import com.hkare.hkare_backend.repository.AppointmentRepository;
import com.hkare.hkare_backend.repository.PatientRepository;
import com.hkare.hkare_backend.repository.PaymentRepository;
import com.hkare.hkare_backend.repository.StaffRepository;
import com.hkare.hkare_backend.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final StaffRepository staffRepository;
    
    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = mapRequestToEntity(request);
        Payment savedPayment = paymentRepository.save(payment);
        
        // If payment is for an appointment, update the appointment payment status
        if (payment.getAppointment() != null) {
            Appointment appointment = payment.getAppointment();
            appointment.setIsPaid(true);
            appointmentRepository.save(appointment);
        }
        
        return mapEntityToResponse(savedPayment);
    }
    
    @Override
    @Transactional
    public PaymentResponse updatePayment(Long paymentId, PaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));
        
        // Update payment fields
        updatePaymentFromRequest(payment, request);
        
        Payment updatedPayment = paymentRepository.save(payment);
        return mapEntityToResponse(updatedPayment);
    }
    
    @Override
    public Optional<PaymentResponse> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .map(this::mapEntityToResponse);
    }
    
    @Override
    @Transactional
    public boolean deletePayment(Long paymentId) {
        if (paymentRepository.existsById(paymentId)) {
            Payment payment = paymentRepository.findById(paymentId).get();
            
            // If payment is for an appointment, update the appointment payment status
            if (payment.getAppointment() != null) {
                Appointment appointment = payment.getAppointment();
                // Check if this is the only payment for this appointment
                List<Payment> appointmentPayments = paymentRepository.findByAppointment(appointment);
                if (appointmentPayments.size() <= 1) {
                    appointment.setIsPaid(false);
                    appointmentRepository.save(appointment);
                }
            }
            
            paymentRepository.deleteById(paymentId);
            return true;
        }
        return false;
    }
    
    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponse> getPaymentsByPatient(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        
        return paymentRepository.findByPatient(patient).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponse> getPaymentsByAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
        
        return paymentRepository.findByAppointment(appointment).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponse> getPaymentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findPaymentsBetweenDates(startDate, endDate).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponse> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponse> getPaymentsByType(Payment.PaymentType type) {
        return paymentRepository.findByType(type).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));
        
        payment.setStatus(status);
        
        // If status is COMPLETED, update the appointment isPaid status
        if (status == Payment.PaymentStatus.COMPLETED && payment.getAppointment() != null) {
            Appointment appointment = payment.getAppointment();
            appointment.setIsPaid(true);
            appointmentRepository.save(appointment);
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        return mapEntityToResponse(updatedPayment);
    }
    
    @Override
    public Double getTotalRevenueForPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        Double totalRevenue = paymentRepository.getTotalRevenueForPeriod(startDate, endDate);
        return totalRevenue != null ? totalRevenue : 0.0;
    }
    
    @Override
    public Map<Integer, Double> getMonthlyRevenueForYear(int year) {
        List<Object[]> monthlyRevenue = paymentRepository.getMonthlyRevenueForYear(year);
        Map<Integer, Double> result = new HashMap<>();
        
        for (Object[] row : monthlyRevenue) {
            Integer month = ((Number) row[0]).intValue();
            Double revenue = ((Number) row[1]).doubleValue();
            result.put(month, revenue);
        }
        
        // Fill in missing months with zero
        for (int month = 1; month <= 12; month++) {
            if (!result.containsKey(month)) {
                result.put(month, 0.0);
            }
        }
        
        return result;
    }
    
    @Override
    public Double getTotalRevenueForMonth(int year, int month) {
        Double totalRevenue = paymentRepository.getTotalRevenueForMonth(year, month);
        return totalRevenue != null ? totalRevenue : 0.0;
    }
    
    @Override
    public long countPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.countPaymentsByStatus(status);
    }
    
    private Payment mapRequestToEntity(PaymentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
        
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
        }
        
        Staff staff = null;
        if (request.getStaffId() != null) {
            staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Staff not found with ID: " + request.getStaffId()));
        }
        
        Payment payment = new Payment();
        payment.setPatient(patient);
        payment.setAppointment(appointment);
        payment.setAmount(request.getAmount());
        payment.setType(request.getType());
        payment.setStatus(request.getStatus() != null ? request.getStatus() : Payment.PaymentStatus.PENDING);
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNotes(request.getNotes());
        payment.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDateTime.now());
        payment.setReceivedBy(staff);
        
        return payment;
    }
    
    private void updatePaymentFromRequest(Payment payment, PaymentRequest request) {
        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + request.getPatientId()));
            payment.setPatient(patient);
        }
        
        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));
            payment.setAppointment(appointment);
        }
        
        if (request.getStaffId() != null) {
            Staff staff = staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Staff not found with ID: " + request.getStaffId()));
            payment.setReceivedBy(staff);
        }
        
        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        
        if (request.getType() != null) {
            payment.setType(request.getType());
        }
        
        if (request.getStatus() != null) {
            payment.setStatus(request.getStatus());
        }
        
        payment.setTransactionId(request.getTransactionId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setNotes(request.getNotes());
        
        if (request.getPaymentDate() != null) {
            payment.setPaymentDate(request.getPaymentDate());
        }
    }
    
    private PaymentResponse mapEntityToResponse(Payment payment) {
        PaymentResponse.PaymentResponseBuilder builder = PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .type(payment.getType())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .notes(payment.getNotes())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt());

        // Handle patient information
        if (payment.getPatient() != null) {
            builder.patientId(payment.getPatient().getPatientId())
                   .patientName(payment.getPatient().getFirstName() + " " + payment.getPatient().getLastName());
        }

        // Handle appointment information
        if (payment.getAppointment() != null) {
            Appointment appointment = payment.getAppointment();
            LocalDateTime appointmentDateTime = LocalDateTime.of(
                    appointment.getAppointmentDate(),
                    appointment.getStartTime() != null ? appointment.getStartTime() : LocalTime.MIDNIGHT
            );
            
            builder.appointmentId(appointment.getAppointmentId())
                   .appointmentDateTime(appointmentDateTime);
            
            // Handle doctor information if available
            if (appointment.getDoctor() != null) {
                builder.doctorName("Dr. " + appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            }
        }

        // Handle staff information
        if (payment.getReceivedBy() != null) {
            Staff staff = payment.getReceivedBy();
            builder.staffId(staff.getStaffId())
                   .staffName(staff.getFirstName() + " " + staff.getLastName());
        }

        return builder.build();
    }
} 