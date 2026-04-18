package org.practicals.backend.controller.userManagement;

import jakarta.validation.Valid;
import org.practicals.backend.dto.userManagement.TechnicianOptionResponse;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.dto.userManagement.UserUpdateRequest;
import org.practicals.backend.security.services.UserDetailsImpl;
import org.practicals.backend.service.userManagement.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getUserProfileByUsername(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestPart("user") UserUpdateRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(userService.updateUserProfile(userDetails.getId(), request, image));
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.deleteUserById(userDetails.getId());
        return ResponseEntity.ok("User account deleted successfully.");
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TechnicianOptionResponse>> getTechnicians() {
        return ResponseEntity.ok(userService.getTechnicians());
    }
}
