package com.cart.ecom_proj.Config;

import com.cart.ecom_proj.repo.UserRepository;
import com.cart.ecom_proj.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Конфигурация для внедрения сервиса UserDetailsService.
 * Используется для интеграции с Spring Security.
 */
@Configuration
public class UserDetailsConfig {

    /**
     * Бин сервиса загрузки пользователя по логину.
     * @param userRepository репозиторий пользователей
     * @return UserDetailsService
     */
    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new UserDetailsServiceImpl(userRepository);
    }
}