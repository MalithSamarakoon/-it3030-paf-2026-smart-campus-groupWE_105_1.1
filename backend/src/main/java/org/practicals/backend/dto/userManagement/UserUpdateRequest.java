package org.practicals.backend.dto.userManagement;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateRequest {
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^$|^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;
    private Set<String> notificationPreferences;
}

