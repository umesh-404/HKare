package com.hkare.hkare_backend.service.impl;

import com.hkare.hkare_backend.dto.DoctorResponse;
import com.hkare.hkare_backend.model.Doctor;
import com.hkare.hkare_backend.repository.DoctorRepository;
import com.hkare.hkare_backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<DoctorResponse> getAllDoctorResponses() {
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            return doctors.stream()
                    .map(doctor -> {
                        try {
                            return DoctorResponse.fromDoctor(doctor);
                        } catch (Exception e) {
                            System.err.println("Error mapping doctor to response: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(response -> response != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all doctor responses: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Optional<Doctor> getDoctorById(String doctorId) {
        return doctorRepository.findByDoctorId(doctorId);
    }

    @Override
    public Optional<DoctorResponse> getDoctorResponseById(String doctorId) {
        return doctorRepository.findByDoctorId(doctorId)
                .map(DoctorResponse::fromDoctor);
    }
} 