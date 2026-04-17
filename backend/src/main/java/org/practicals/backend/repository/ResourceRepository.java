package org.practicals.backend.repository;

import org.practicals.backend.model.resource.Resource;
import org.practicals.backend.model.resource.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);
}
