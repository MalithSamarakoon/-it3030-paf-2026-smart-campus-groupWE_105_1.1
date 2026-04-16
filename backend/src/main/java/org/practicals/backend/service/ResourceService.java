package org.practicals.backend.service;

import org.practicals.backend.dto.ResourceDTO;
import org.practicals.backend.model.resource.ResourceType;

import java.util.List;

public interface ResourceService {
    ResourceDTO createResource(ResourceDTO resourceDTO, String username);
    ResourceDTO updateResource(Long id, ResourceDTO resourceDTO);
    void deleteResource(Long id);
    ResourceDTO getResourceById(Long id);
    List<ResourceDTO> getAllResources(ResourceType type, Integer capacity, String location);
}
