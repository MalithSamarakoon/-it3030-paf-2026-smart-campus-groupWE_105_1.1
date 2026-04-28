package org.practicals.backend.dto.incidentTicket;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    @Size(max = 120, message = "Title must not exceed 120 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Pattern(regexp = "^(ELECTRICAL|PLUMBING|IT_EQUIPMENT|OTHER)$", message = "Invalid category")
    private String category;

    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", message = "Invalid priority")
    private String priority;

    @Size(max = 255, message = "Resource location is too long")
    private String resourceLocation;

    @Size(max = 255, message = "Preferred contact is too long")
    private String preferredContact;

    private String imageData1;
    private String imageData2;
    private String imageData3;
}