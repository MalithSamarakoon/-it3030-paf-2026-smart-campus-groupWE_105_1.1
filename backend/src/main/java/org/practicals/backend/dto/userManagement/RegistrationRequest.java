package org.practicals.backend.dto.userManagement;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationRequest {
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Pattern(regexp = "^$|^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phoneNumber;

    @Pattern(
            regexp = "^$|^(?i)(STUDENT|TECHNICIAN|STAFF|ROLE_STUDENT|ROLE_STAFF)$",
            message = "Role must be STUDENT or TECHNICIAN"
    )
    private String role;

    @Pattern(
            regexp = "^$|^(?i)(ELECTRICAL|PLUMBING|IT_EQUIPMENT|IT EQUIPMENT)$",
            message = "Technician type must be ELECTRICAL, PLUMBING, or IT_EQUIPMENT"
    )
    private String technicianType;
}
