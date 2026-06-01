package com.meditrack.service;

import com.meditrack.dto.PrescriptionRequest;
import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
import com.meditrack.model.Prescription;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.PatientRepository;
import com.meditrack.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrescriptionService {

    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;

    public Prescription addPrescription(PrescriptionRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setDiagnosis(req.getDiagnosis());
        prescription.setMedicineName(req.getMedicineName());
        prescription.setDosage(req.getDosage());
        prescription.setDuration(req.getDuration());
        prescription.setInstructions(req.getInstructions());
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }
}
