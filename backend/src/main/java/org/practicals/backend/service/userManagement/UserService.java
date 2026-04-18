package org.practicals.backend.service.userManagement;

import org.practicals.backend.dto.userManagement.RegistrationRequest;
import org.practicals.backend.dto.userManagement.TechnicianOptionResponse;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.dto.userManagement.UserUpdateRequest;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.TechnicianType;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.practicals.backend.security.jwt.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService; // Added
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       FileStorageService fileStorageService, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public UserResponse registerUser(RegistrationRequest request) {
        Role targetRole = resolveRegistrationRole(request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        String resolvedUsername = resolveUsername(request, targetRole);
        if (userRepository.existsByUsername(resolvedUsername)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        String resolvedPhoneNumber = null;
        TechnicianType technicianType = null;

        if (targetRole == Role.ROLE_STUDENT) {
            if (request.getPhoneNumber() == null || !request.getPhoneNumber().matches("^\\d{10}$")) {
                throw new IllegalArgumentException("Phone number must be exactly 10 digits.");
            }
            resolvedPhoneNumber = request.getPhoneNumber();
        } else {
            technicianType = parseTechnicianType(request.getTechnicianType());
        }

        if (!isEmailValidForRole(request.getEmail(), targetRole)) {
            if (targetRole == Role.ROLE_STAFF) {
                throw new IllegalArgumentException("Technician email must be a valid '@sliit.lk' address.");
            }
            throw new IllegalArgumentException("Student email must follow format like it21xxxxxx@my.sliit.lk.");
        }


        if (!isPasswordValid(request.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters long, " +
                    "contain an uppercase letter, a lowercase letter, a digit, and a special character.");
        }


        User user = new User();
        user.setUsername(resolvedUsername);
        user.setEmail(request.getEmail());
        user.setPhoneNumber(resolvedPhoneNumber);
        user.setTechnicianType(technicianType);


        user.setPassword(passwordEncoder.encode(request.getPassword()));


        user.setRole(targetRole);


        User savedUser = userRepository.save(user);


        return mapToUserResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request, MultipartFile image) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.saveProfileImage(image);
            user.setProfilePicturePath(fileName);
        }

        User updatedUser = userRepository.save(user);
        UserResponse response = mapToUserResponse(updatedUser);

        // Generate a new token in case the username changed
        String newToken = jwtUtils.generateTokenFromUsername(updatedUser.getUsername());
        response.setToken(newToken);

        return response;
    }

    @Transactional
    public void deleteUserById(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public void processOAuthPostLogin(String email, String name) {
        if (!userRepository.existsByEmail(email)) {
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setEmail(email);
            newUser.setRole(Role.ROLE_STUDENT);
            newUser.setPassword("");
            userRepository.save(newUser);
        }
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setTechnicianType(user.getTechnicianType() != null ? user.getTechnicianType().name() : null);
        response.setProfilePicturePath(user.getProfilePicturePath()); // Map this
        return response;
    }


    private Role resolveRegistrationRole(String requestedRole) {
        if (requestedRole == null || requestedRole.isBlank()) {
            return Role.ROLE_STUDENT;
        }

        String normalized = requestedRole.trim().toUpperCase();
        return switch (normalized) {
            case "STUDENT", "ROLE_STUDENT" -> Role.ROLE_STUDENT;
            case "TECHNICIAN", "STAFF", "ROLE_STAFF" -> Role.ROLE_STAFF;
            default -> throw new IllegalArgumentException("Invalid role. Allowed roles: STUDENT, TECHNICIAN.");
        };
    }

    private String resolveUsername(RegistrationRequest request, Role role) {
        if (role == Role.ROLE_STUDENT) {
            if (request.getUsername() == null || request.getUsername().isBlank()) {
                throw new IllegalArgumentException("Username is required for student registration.");
            }
            return request.getUsername().trim();
        }

        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : "technician";
        String normalized = localPart.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]", "");
        if (normalized.isBlank()) {
            normalized = "technician";
        }

        return generateUniqueUsername(normalized);
    }

    private String generateUniqueUsername(String base) {
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }

    private TechnicianType parseTechnicianType(String technicianType) {
        if (technicianType == null || technicianType.isBlank()) {
            throw new IllegalArgumentException("Technician type is required.");
        }

        String normalized = technicianType.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "ELECTRICAL" -> TechnicianType.ELECTRICAL;
            case "PLUMBING" -> TechnicianType.PLUMBING;
            case "IT_EQUIPMENT", "IT EQUIPMENT" -> TechnicianType.IT_EQUIPMENT;
            default -> throw new IllegalArgumentException("Invalid technician type. Allowed types: electrical, plumbing, it equipment.");
        };
    }

    private boolean isEmailValidForRole(String email, Role role) {
        if (email == null) {
            return false;
        }

        if (role == Role.ROLE_STAFF) {
            String staffEmailPattern = "^[A-Za-z0-9._%+-]+@sliit\\.lk$";
            return email.matches(staffEmailPattern);
        }

        String studentEmailPattern = "^(?i)it.*@my\\.sliit\\.lk$";
        return email.matches(studentEmailPattern);
    }

    private boolean isPasswordValid(String password) {
        if (password == null) return false;

        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        return password.matches(passwordPattern);
    }



    public UserResponse getUserProfileByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return mapToUserResponse(user);
    }

    public List<TechnicianOptionResponse> getTechnicians() {
        return userRepository.findByRoleOrderByUsernameAsc(Role.ROLE_STAFF)
                .stream()
                .map(user -> new TechnicianOptionResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getTechnicianType() != null ? user.getTechnicianType().name() : "UNSPECIFIED"
                ))
                .collect(Collectors.toList());
    }
}

