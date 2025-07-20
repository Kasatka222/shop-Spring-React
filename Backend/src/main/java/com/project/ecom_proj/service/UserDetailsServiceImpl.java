package com.cart.ecom_proj.service;

import com.cart.ecom_proj.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Реализация сервиса загрузки пользователя для Spring Security.
 * Позволяет искать пользователя по логину.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    /**
     * Репозиторий пользователей.
     */
    private final UserRepository userRepository;

    /**
     * Загрузить пользователя по логину.
     * @param username логин пользователя
     * @return UserDetails пользователя
     * @throws UsernameNotFoundException если пользователь не найден
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}