package org.practicals.backend.dto.userManagement;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String username;
    private String email;
    private String phoneNumber;
}

