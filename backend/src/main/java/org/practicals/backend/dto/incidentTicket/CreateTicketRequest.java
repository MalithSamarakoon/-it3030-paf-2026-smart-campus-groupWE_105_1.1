package org.practicals.backend.dto.incidentTicket;

import lombok.Data;

@Data
public class CreateTicketRequest {
    private String title;
    private String description;
    private String category;
    private String priority;
    private String resourceLocation;
    private String preferredContact;
    private String imageData1;
    private String imageData2;
    private String imageData3;
}
