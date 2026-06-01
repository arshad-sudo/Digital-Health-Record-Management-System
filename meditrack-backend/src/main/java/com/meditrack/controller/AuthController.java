package com.meditrack.controller;

import com.meditrack.dto.LoginRequest;
import com.meditrack.dto.LoginResponse;
import com.meditrack.dto.PatientRegisterRequest;
import com.meditrack.model.Patient;
import com.meditrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody PatientRegisterRequest request) {
        try {
            Patient patient = authService.registerPatient(request);
            return ResponseEntity.ok(Map.of(
                "message", "Patient registered successfully",
                "patientId", patient.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
