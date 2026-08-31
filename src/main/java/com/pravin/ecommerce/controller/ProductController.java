package com.pravin.ecommerce.controller;

import com.pravin.ecommerce.product.Shirt;
import com.pravin.ecommerce.product.ShirtRepository;
import com.pravin.ecommerce.service.MinioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ShirtRepository shirtRepository;
    private final MinioService minioService;

    public ProductController(ShirtRepository shirtRepository, MinioService minioService) {
        this.shirtRepository = shirtRepository;
        this.minioService = minioService;
    }

    @PostMapping
    public ResponseEntity<Shirt> createProduct(@RequestBody Shirt shirt) {
        Shirt savedShirt = shirtRepository.save(shirt);
        return ResponseEntity.ok(savedShirt);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Shirt> shirtOptional = shirtRepository.findById(id);
        if (shirtOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            String imageUrl = minioService.uploadImage(file);
            Shirt shirt = shirtOptional.get();
            shirt.setImageUrl(imageUrl);
            shirtRepository.save(shirt);
            return ResponseEntity.ok(shirt);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shirt> updateProduct(@PathVariable Long id, @RequestBody Shirt updatedShirt) {
        return shirtRepository.findById(id).map(shirt -> {
            shirt.setName(updatedShirt.getName());
            shirt.setPrice(updatedShirt.getPrice());
            shirt.setSize(updatedShirt.getSize());
            shirt.setColor(updatedShirt.getColor());
            if (updatedShirt.getImageUrl() != null) {
                shirt.setImageUrl(updatedShirt.getImageUrl());
            }
            return ResponseEntity.ok(shirtRepository.save(shirt));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Shirt>> getAllProducts() {
        return ResponseEntity.ok(shirtRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shirt> getProductById(@PathVariable Long id) {
        return shirtRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!shirtRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        shirtRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
