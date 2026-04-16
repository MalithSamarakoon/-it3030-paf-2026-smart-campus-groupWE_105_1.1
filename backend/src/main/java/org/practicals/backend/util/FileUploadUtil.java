package org.practicals.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
public class FileUploadUtil {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "jpg", "jpeg", "png", "webp"
    ));

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Save multiple image files and return their URLs
     */
    public List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        if (images == null || images.isEmpty()) {
            return imageUrls;
        }

        // Validate number of images
        if (images.size() > 4) {
            throw new IllegalArgumentException("Maximum 4 images allowed. You provided " + images.size());
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile image : images) {
            if (image.isEmpty()) {
                continue;
            }

            // Validate file
            validateFile(image);

            // Generate unique filename
            String filename = generateUniqueFilename(image.getOriginalFilename());

            // Save file
            Path filepath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filepath);

            // Store the URL path relative to uploads directory
            imageUrls.add("/uploads/" + filename);
        }

        return imageUrls;
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB: " + file.getOriginalFilename());
        }

        // Check file extension
        String filename = file.getOriginalFilename();
        if (filename == null || !isValidExtension(filename)) {
            throw new IllegalArgumentException("Invalid file type. Allowed types: jpg, jpeg, png, webp");
        }
    }

    /**
     * Check if file extension is allowed
     */
    private boolean isValidExtension(String filename) {
        int lastIndexOf = filename.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return false;
        }
        String extension = filename.substring(lastIndexOf + 1).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    /**
     * Generate unique filename to prevent conflicts
     */
    private String generateUniqueFilename(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * Delete image file by URL
     */
    public void deleteImage(String imageUrl) {
        try {
            // Extract filename from URL (e.g., "/uploads/filename.jpg" -> "filename.jpg")
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filepath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(filepath)) {
                Files.delete(filepath);
            }
        } catch (IOException e) {
            // Log error but don't throw - image might already be deleted
            System.err.println("Failed to delete image: " + imageUrl + " - " + e.getMessage());
        }
    }

    /**
     * Delete multiple image files
     */
    public void deleteImages(List<String> imageUrls) {
        if (imageUrls != null) {
            imageUrls.forEach(this::deleteImage);
        }
    }
}
