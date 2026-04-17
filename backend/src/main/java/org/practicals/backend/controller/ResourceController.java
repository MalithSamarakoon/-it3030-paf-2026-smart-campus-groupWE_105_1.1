package org.practicals.backend.controller;

import org.practicals.backend.dto.ResourceDTO;
import org.practicals.backend.model.resource.ResourceType;
import org.practicals.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(resourceService.getAllResources(type, capacity, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam String location,
            @RequestParam String status,
            @RequestParam(required = false) String availabilityStart,
            @RequestParam(required = false) String availabilityEnd,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ResourceDTO resourceDTO = new ResourceDTO();
        resourceDTO.setName(name);
        resourceDTO.setType(org.practicals.backend.model.resource.ResourceType.valueOf(type));
        resourceDTO.setCapacity(capacity);
        resourceDTO.setLocation(location);
        resourceDTO.setStatus(org.practicals.backend.model.resource.ResourceStatus.valueOf(status));

        if (availabilityStart != null && !availabilityStart.isEmpty()) {
            resourceDTO.setAvailabilityStart(java.time.LocalTime.parse(availabilityStart + ":00"));
        }
        if (availabilityEnd != null && !availabilityEnd.isEmpty()) {
            resourceDTO.setAvailabilityEnd(java.time.LocalTime.parse(availabilityEnd + ":00"));
        }

        resourceDTO.setImages(images);

        ResourceDTO created = resourceService.createResource(resourceDTO, username);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam String location,
            @RequestParam String status,
            @RequestParam(required = false) String availabilityStart,
            @RequestParam(required = false) String availabilityEnd,
            @RequestParam(required = false) List<MultipartFile> images) throws IOException {

        ResourceDTO resourceDTO = new ResourceDTO();
        resourceDTO.setName(name);
        resourceDTO.setType(org.practicals.backend.model.resource.ResourceType.valueOf(type));
        resourceDTO.setCapacity(capacity);
        resourceDTO.setLocation(location);
        resourceDTO.setStatus(org.practicals.backend.model.resource.ResourceStatus.valueOf(status));

        if (availabilityStart != null && !availabilityStart.isEmpty()) {
            resourceDTO.setAvailabilityStart(java.time.LocalTime.parse(availabilityStart + ":00"));
        }
        if (availabilityEnd != null && !availabilityEnd.isEmpty()) {
            resourceDTO.setAvailabilityEnd(java.time.LocalTime.parse(availabilityEnd + ":00"));
        }

        resourceDTO.setImages(images);

        return ResponseEntity.ok(resourceService.updateResource(id, resourceDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().build();
    }
}
