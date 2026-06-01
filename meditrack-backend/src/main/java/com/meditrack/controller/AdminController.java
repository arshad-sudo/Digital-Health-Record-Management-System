package com.meditrack.controller;

import com.meditrack.model.Appointment;
import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
import com.meditrack.repository.AppointmentRepository;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.MedicalReportRepository;
import com.meditrack.repository.PatientRepository;
import com.meditrack.repository.PrescriptionRepository;
import com.meditrack.service.DoctorService;
import com.meditrack.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private MedicalReportRepository reportRepository;
    @Autowired private DoctorService doctorService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalPrescriptions", prescriptionRepository.count());
        stats.put("totalReports", reportRepository.count());
        stats.put("pendingAppointments",
            (long) appointmentRepository.findByStatus(Appointment.AppointmentStatus.PENDING).size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor saved = doctorService.addDoctor(doctor);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted"));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted"));
    }
}
