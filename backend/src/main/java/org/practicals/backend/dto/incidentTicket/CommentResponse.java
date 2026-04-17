package org.practicals.backend.dto.incidentTicket;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String authorUsername;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
