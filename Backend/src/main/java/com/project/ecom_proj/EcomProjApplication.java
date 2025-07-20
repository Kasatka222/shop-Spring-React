package com.cart.ecom_proj;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EcomProjApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcomProjApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByLogin("admin").isEmpty()) {
				User admin = User.builder()
					.login("admin")
					.hashPassword(passwordEncoder.encode("password"))
					.role("ADMIN")
					.build();
				userRepository.save(admin);
			}
		};
	}
}
