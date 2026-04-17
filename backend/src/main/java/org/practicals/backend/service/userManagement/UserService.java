package org.practicals.backend.service.userManagement;

import org.practicals.backend.dto.userManagement.RegistrationRequest;
import org.practicals.backend.dto.userManagement.UserResponse;
import org.practicals.backend.dto.userManagement.UserUpdateRequest;
import org.practicals.backend.exception.ResourceNotFoundException;
import org.practicals.backend.model.userManagement.Role;
import org.practicals.backend.model.userManagement.User;
import org.practicals.backend.repository.userManagement.UserRepository;
import org.practicals.backend.security.jwt.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    public UserResponse registerStudent(RegistrationRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        if (request.getPhoneNumber() == null || !request.getPhoneNumber().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits.");
        }

        if (!isEmailValid(request.getEmail())) {
            throw new IllegalArgumentException("Email must start with 'it' or 'IT' and contain a valid '@' symbol.");
        }


        if (!isPasswordValid(request.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 8 characters long, " +
                    "contain an uppercase letter, a lowercase letter, a digit, and a special character.");
        }


        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());


        user.setPassword(passwordEncoder.encode(request.getPassword()));


        user.setRole(Role.ROLE_STUDENT);


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
        response.setProfilePicturePath(user.getProfilePicturePath()); // Map this
        return response;
    }


    private boolean isEmailValid(String email) {
        if (email == null) return false;

        String emailPattern = "^(?i)it.*@my\\.sliit\\.lk$";
        return email.matches(emailPattern);
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
}

