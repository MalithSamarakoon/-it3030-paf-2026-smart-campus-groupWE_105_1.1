package org.practicals.backend.dto.incidentTicket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(OPEN|IN_PROGRESS|RESOLVED|CLOSED|REJECTED)$", message = "Invalid status")
    private String status;

    @Size(max = 1000, message = "Rejection reason must not exceed 1000 characters")
    private String rejectionReason;

    @Size(max = 1000, message = "Resolution notes must not exceed 1000 characters")
    private String resolutionNotes;
}
