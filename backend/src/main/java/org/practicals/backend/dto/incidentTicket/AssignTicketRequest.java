package org.practicals.backend.dto.incidentTicket;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AssignTicketRequest {
    @NotNull(message = "Assigned technician is required")
    @Positive(message = "Assigned technician ID must be positive")
    private Long assignedToUserId;
}
