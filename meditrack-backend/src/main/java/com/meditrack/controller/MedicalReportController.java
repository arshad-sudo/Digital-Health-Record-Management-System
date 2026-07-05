package com.meditrack.controller;

import com.meditrack.model.MedicalReport;
import com.meditrack.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")

public class MedicalReportController {

    @Autowired
    private MedicalReportService reportService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(
            @RequestParam("patientId") Long patientId,
            @RequestParam(value = "doctorId", required = false) Long doctorId,
            @RequestParam("reportType") String reportType,
            @RequestParam("file") MultipartFile file) {
        try {
            MedicalReport report = reportService.uploadReport(patientId, doctorId, reportType, file);
            return ResponseEntity.ok(report);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "File upload failed: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<MedicalReport>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalReport>> getPatientReports(@PathVariable Long patientId) {
        return ResponseEntity.ok(reportService.getReportsByPatient(patientId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
    }
}
