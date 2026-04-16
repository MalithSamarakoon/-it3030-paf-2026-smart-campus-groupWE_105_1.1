package org.practicals.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.practicals.backend.model.resource.ResourceStatus;
import org.practicals.backend.model.resource.ResourceType;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
import java.util.List;

@Data
public class ResourceDTO {
    
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private LocalTime availabilityStart;

    private LocalTime availabilityEnd;

    private List<MultipartFile> images;

    private List<String> imageUrls;

    private String createdByUsername;
}
