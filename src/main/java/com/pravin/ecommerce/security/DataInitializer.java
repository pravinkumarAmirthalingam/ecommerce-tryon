package com.pravin.ecommerce.security;

import com.pravin.ecommerce.user.Role;
import com.pravin.ecommerce.user.User;
import com.pravin.ecommerce.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);

            // Seed Standard User
            User standardUser = new User();
            standardUser.setName("Standard User");
            standardUser.setEmail("user@test.com");
            standardUser.setPassword(passwordEncoder.encode("password"));
            standardUser.setRole(Role.ROLE_USER);
            userRepository.save(standardUser);

            System.out.println("----------------------------------------");
            System.out.println("Default accounts seeded successfully:");
            System.out.println("ADMIN: admin@test.com / password");
            System.out.println("USER:  user@test.com / password");
            System.out.println("----------------------------------------");
        }
    }
}
