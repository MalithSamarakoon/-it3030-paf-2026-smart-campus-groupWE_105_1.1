package org.practicals.backend.dto.userManagement;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
}
