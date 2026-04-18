package org.practicals.backend.dto.incidentTicket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String content;
}
