package com.meditrack.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientRegisterRequest {
    private String fullName;
    private Integer age;
    private String gender;
    private LocalDate dob;
    private String bloodGroup;
    private String contactNumber;
    private String email;
    private String password;
    private String address;
    private String medicalHistory;
    private String emergencyContact;
}
