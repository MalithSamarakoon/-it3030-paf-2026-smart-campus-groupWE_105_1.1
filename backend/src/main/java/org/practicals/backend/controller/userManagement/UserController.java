package org.practicals.backend.controller.userManagement;

import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.dto.userManagement.UserUpdateRequest;
import org.practicals.backend.security.services.UserDetailsImpl;
import org.practicals.backend.service.userManagement.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
                @RequestPart("user") UserUpdateRequest request,
                @RequestPart(value = "profileImage", required = false) MultipartFile image) throws IOException {
            return ResponseEntity.ok(userService.updateUserProfile(userDetails.getId(), request, image));
        }
    }

