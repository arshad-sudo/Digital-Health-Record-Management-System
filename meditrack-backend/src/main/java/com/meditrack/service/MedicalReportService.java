package com.meditrack.service;

import com.meditrack.model.Doctor;
import com.meditrack.model.MedicalReport;
import com.meditrack.model.Patient;
import com.meditrack.repository.DoctorRepository;
import com.meditrack.repository.MedicalReportRepository;
import com.meditrack.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class MedicalReportService {

    @Autowired private MedicalReportRepository reportRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private DoctorRepository doctorRepository;

    @Value("${meditrack.upload.path}")
    private String uploadPath;

    public MedicalReport uploadReport(Long patientId, Long doctorId, String reportType, MultipartFile file) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorId != null ? doctorRepository.findById(doctorId).orElse(null) : null;

        // Save file
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
        String savedFileName = UUID.randomUUID() + extension;
        Path filePath = uploadDir.resolve(savedFileName);
        Files.copy(file.getInputStream(), filePath);

        MedicalReport report = new MedicalReport();
        report.setPatient(patient);
        report.setDoctor(doctor);
        report.setReportType(reportType);
        report.setUploadDate(LocalDate.now());
        report.setFilePath(uploadPath + savedFileName);
        report.setFileName(originalFilename);
        report.setFileSize(file.getSize() / 1024 + " KB");
        return reportRepository.save(report);
    }

    public List<MedicalReport> getReportsByPatient(Long patientId) {
        return reportRepository.findByPatientId(patientId);
    }

    public List<MedicalReport> getAllReports() {
        return reportRepository.findAll();
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
}
