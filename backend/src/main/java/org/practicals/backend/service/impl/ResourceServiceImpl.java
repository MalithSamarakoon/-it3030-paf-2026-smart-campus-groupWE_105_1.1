package org.practicals.backend.service.impl;

import org.practicals.backend.dto.ResourceDTO;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.resource.Resource;
import org.practicals.backend.model.resource.ResourceType;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.ResourceRepository;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.practicals.backend.service.ResourceService;
import org.practicals.backend.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final FileUploadUtil fileUploadUtil;

    @Autowired
    public ResourceServiceImpl(ResourceRepository resourceRepository, UserRepository userRepository, FileUploadUtil fileUploadUtil) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.fileUploadUtil = fileUploadUtil;
    }

    @Override
    public ResourceDTO createResource(ResourceDTO resourceDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Resource resource = mapToEntity(resourceDTO);
        resource.setCreatedBy(user);

        // Handle image uploads
        List<MultipartFile> images = resourceDTO.getImages();
        if (images != null && !images.isEmpty()) {
            try {
                List<String> imageUrls = fileUploadUtil.saveImages(images);
                resource.setImageUrls(imageUrls);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload images: " + e.getMessage());
            }
        }

        Resource savedResource = resourceRepository.save(resource);
        return mapToDTO(savedResource);
    }

    @Override
    public ResourceDTO updateResource(Long id, ResourceDTO resourceDTO) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setCapacity(resourceDTO.getCapacity());
        resource.setLocation(resourceDTO.getLocation());
        resource.setStatus(resourceDTO.getStatus());
        resource.setAvailabilityStart(resourceDTO.getAvailabilityStart());
        resource.setAvailabilityEnd(resourceDTO.getAvailabilityEnd());

        // Handle image uploads
        List<MultipartFile> images = resourceDTO.getImages();
        if (images != null && !images.isEmpty()) {
            try {
                // Delete old images
                if (resource.getImageUrls() != null) {
                    fileUploadUtil.deleteImages(resource.getImageUrls());
                }
                // Save new images
                List<String> imageUrls = fileUploadUtil.saveImages(images);
                resource.setImageUrls(imageUrls);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload images: " + e.getMessage());
            }
        }

        Resource updatedResource = resourceRepository.save(resource);
        return mapToDTO(updatedResource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        // Delete associated images
        if (resource.getImageUrls() != null) {
            fileUploadUtil.deleteImages(resource.getImageUrls());
        }

        resourceRepository.delete(resource);
    }

    @Override
    public ResourceDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return mapToDTO(resource);
    }

    @Override
    public List<ResourceDTO> getAllResources(ResourceType type, Integer capacity, String location) {
        List<Resource> resources;
        
        if (type != null) {
            resources = resourceRepository.findByType(type);
        } else if (capacity != null) {
            resources = resourceRepository.findByCapacityGreaterThanEqual(capacity);
        } else if (location != null && !location.trim().isEmpty()) {
            resources = resourceRepository.findByLocationContainingIgnoreCase(location.trim());
        } else {
            resources = resourceRepository.findAll();
        }
        
        return resources.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private Resource mapToEntity(ResourceDTO dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(dto.getStatus());
        resource.setAvailabilityStart(dto.getAvailabilityStart());
        resource.setAvailabilityEnd(dto.getAvailabilityEnd());
        return resource;
    }

    private ResourceDTO mapToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setStatus(resource.getStatus());
        dto.setAvailabilityStart(resource.getAvailabilityStart());
        dto.setAvailabilityEnd(resource.getAvailabilityEnd());
        dto.setImageUrls(resource.getImageUrls());
        if (resource.getCreatedBy() != null) {
            dto.setCreatedByUsername(resource.getCreatedBy().getUsername());
        }
        return dto;
    }
}
