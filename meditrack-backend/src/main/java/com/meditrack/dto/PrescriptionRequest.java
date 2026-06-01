package com.meditrack.dto;

import lombok.Data;

@Data
public class PrescriptionRequest {
    private Long patientId;
    private Long doctorId;
    private String diagnosis;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instructions;
}
