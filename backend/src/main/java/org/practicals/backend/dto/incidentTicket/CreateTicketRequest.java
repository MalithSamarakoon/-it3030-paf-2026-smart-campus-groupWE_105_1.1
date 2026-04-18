package org.practicals.backend.dto.incidentTicket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTicketRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title must not exceed 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^(ELECTRICAL|PLUMBING|IT_EQUIPMENT|OTHER)$", message = "Invalid category")
    private String category;

    @NotBlank(message = "Priority is required")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", message = "Invalid priority")
    private String priority;

    @NotBlank(message = "Resource location is required")
    @Size(max = 255, message = "Resource location is too long")
    private String resourceLocation;

    @NotBlank(message = "Preferred contact is required")
    @Size(max = 255, message = "Preferred contact is too long")
    private String preferredContact;
    private String imageData1;
    private String imageData2;
    private String imageData3;
}
