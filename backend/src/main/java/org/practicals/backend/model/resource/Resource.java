package org.practicals.backend.model.resource;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.practicals.backend.model.userManagement.User;

import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    private Integer capacity; // Can be null for equipment

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    private LocalTime availabilityStart;

    private LocalTime availabilityEnd;

    @ElementCollection
    @CollectionTable(name = "resource_images", joinColumns = @JoinColumn(name = "resource_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}
