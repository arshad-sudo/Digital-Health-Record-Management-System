package com.meditrack.service;

import com.meditrack.dto.LoginRequest;
import com.meditrack.dto.LoginResponse;
import com.meditrack.dto.PatientRegisterRequest;
import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.PatientRepository;
import com.meditrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public Patient registerPatient(PatientRegisterRequest req) {
        if (patientRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        Patient patient = new Patient();
        patient.setFullName(req.getFullName());
        patient.setAge(req.getAge());
        patient.setGender(req.getGender());
        patient.setDob(req.getDob());
        patient.setBloodGroup(req.getBloodGroup());
        patient.setContactNumber(req.getContactNumber());
        patient.setEmail(req.getEmail());
        patient.setPassword(passwordEncoder.encode(req.getPassword()));
        patient.setAddress(req.getAddress());
        patient.setMedicalHistory(req.getMedicalHistory());
        patient.setEmergencyContact(req.getEmergencyContact());
        return patientRepository.save(patient);
    }

    public LoginResponse login(LoginRequest req) {
        String role = req.getRole() != null ? req.getRole().toUpperCase() : "PATIENT";

        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            if (!passwordEncoder.matches(req.getPassword(), doctor.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }
            String token = jwtUtil.generateToken(doctor.getEmail(), "DOCTOR", doctor.getId());
            return new LoginResponse(token, "DOCTOR", doctor.getId(), doctor.getDoctorName(), doctor.getEmail());
        } else if ("ADMIN".equals(role)) {
            // Hardcoded admin for simplicity
            if ("admin@med.com".equals(req.getEmail()) && "admin123".equals(req.getPassword())) {
                String token = jwtUtil.generateToken("admin@med.com", "ADMIN", 0L);
                return new LoginResponse(token, "ADMIN", 0L, "Admin", "admin@med.com");
            }
            throw new RuntimeException("Invalid admin credentials");
        } else {
            Patient patient = patientRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            if (!passwordEncoder.matches(req.getPassword(), patient.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }
            String token = jwtUtil.generateToken(patient.getEmail(), "PATIENT", patient.getId());
            return new LoginResponse(token, "PATIENT", patient.getId(), patient.getFullName(), patient.getEmail());
        }
    }
}
