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
@RequestMapping("/api/user")
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

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        String email = getAuthenticatedUserEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("Access denied. Admin role required.");
        }
        return ResponseEntity.ok(userRepository.findAll());
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
