package org.practicals.backend.dto.incidentTicket;

import lombok.Data;

@Data
public class UpdateTicketStatusRequest {
    private String status;
    private String rejectionReason;
    private String resolutionNotes;
}
