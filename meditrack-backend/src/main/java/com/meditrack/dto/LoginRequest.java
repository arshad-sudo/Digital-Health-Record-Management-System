package com.meditrack.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String role; // PATIENT, DOCTOR, ADMIN
}
