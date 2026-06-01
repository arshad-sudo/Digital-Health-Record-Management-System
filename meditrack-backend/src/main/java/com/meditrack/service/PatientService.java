package com.meditrack.service;

import com.meditrack.model.Patient;
import com.meditrack.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(patient -> {
            patient.setFullName(updatedPatient.getFullName());
            patient.setAge(updatedPatient.getAge());
            patient.setGender(updatedPatient.getGender());
            patient.setDob(updatedPatient.getDob());
            patient.setBloodGroup(updatedPatient.getBloodGroup());
            patient.setContactNumber(updatedPatient.getContactNumber());
            patient.setAddress(updatedPatient.getAddress());
            patient.setMedicalHistory(updatedPatient.getMedicalHistory());
            patient.setEmergencyContact(updatedPatient.getEmergencyContact());
            return patientRepository.save(patient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
