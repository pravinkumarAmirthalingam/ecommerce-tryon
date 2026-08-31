package com.pravin.ecommerce.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Service
public class TryOnService {

    private final String FLASK_API_URL = "http://localhost:5000/tryon";

    public String processTryOn(MultipartFile userImage, String clothImageUrl) {
        File userFile = null;
        File clothFile = null;
        
        try {
            // Convert user image to temporary file
            userFile = convert(userImage);
            
            // Download cloth image from URL
            clothFile = File.createTempFile("cloth_", ".jpg");
            try (InputStream in = new URL(clothImageUrl).openStream()) {
                Files.copy(in, clothFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }

            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // Wrap the temp files in FileSystemResource so RestTemplate correctly formats the request
            body.add("user_image", new FileSystemResource(userFile));
            body.add("cloth_image", new FileSystemResource(clothFile));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            // Send the POST request to the Python Flask API
            ResponseEntity<String> response = restTemplate.postForEntity(FLASK_API_URL, requestEntity, String.class);
            
            return response.getBody();
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to read or convert image files: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to Flask API: " + e.getMessage());
        } finally {
            // Clean up temporary files to free up disk space
            if (userFile != null && userFile.exists()) userFile.delete();
            if (clothFile != null && clothFile.exists()) clothFile.delete();
        }
    }

    private File convert(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "temp_image.jpg";
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + originalFilename);
        convFile.createNewFile();
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}
