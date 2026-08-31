package com.pravin.ecommerce.controller;

import com.pravin.ecommerce.product.Shirt;
import com.pravin.ecommerce.product.ShirtRepository;
import com.pravin.ecommerce.service.TryOnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

@RestController
@RequestMapping("/api/tryon")
public class TryOnController {

    private final TryOnService tryOnService;
    private final ShirtRepository shirtRepository;

    @Autowired
    public TryOnController(TryOnService tryOnService, ShirtRepository shirtRepository) {
        this.tryOnService = tryOnService;
        this.shirtRepository = shirtRepository;
    }

    @PostMapping
    public ResponseEntity<String> performTryOn(
            @RequestParam("user_image") MultipartFile userImage,
            @RequestParam("product_id") Long productId) {
        
        if (userImage.isEmpty()) {
            return ResponseEntity.badRequest().body("User image is required.");
        }

        Optional<Shirt> shirtOptional = shirtRepository.findById(productId);
        if (shirtOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found.");
        }

        String result = tryOnService.processTryOn(userImage, shirtOptional.get().getImageUrl());
        return ResponseEntity.ok(result);
    }
}
