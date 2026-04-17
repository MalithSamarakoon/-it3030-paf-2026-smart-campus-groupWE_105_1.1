package org.practicals.backend.dto.incidentTicket;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String resourceLocation;
    private String preferredContact;
    private String imageData1;
    private String imageData2;
    private String imageData3;
    private String rejectionReason;
    private String resolutionNotes;
    private String createdByUsername;
    private Long createdById;
    private String assignedToUsername;
    private Long assignedToId;
    private int commentCount;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
