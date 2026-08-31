package com.pravin.ecommerce.controller;

import com.pravin.ecommerce.service.MinioService;
import com.pravin.ecommerce.user.User;
import com.pravin.ecommerce.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;
    private final MinioService minioService;

    public UserController(UserRepository userRepository, MinioService minioService) {
        this.userRepository = userRepository;
        this.minioService = minioService;
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadUserPhoto(@RequestParam("file") MultipartFile file) {
        String email = getAuthenticatedUserEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            String photoUrl = minioService.uploadImage(file);
            User user = optionalUser.get();
            user.setPhotoUrl(photoUrl);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload photo: " + e.getMessage());
        }
    }
}
