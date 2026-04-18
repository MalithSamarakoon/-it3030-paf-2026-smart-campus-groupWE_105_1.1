package org.practicals.backend.dto.userManagement;

import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateRequest {
    private String username;
    private String email;
    private String phoneNumber;
    private Set<String> notificationPreferences;
}

