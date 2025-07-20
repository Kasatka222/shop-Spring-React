package com.cart.ecom_proj.service;


import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.UserRepository;
import com.cart.ecom_proj.controller.dto.AuthResponse;
import com.cart.ecom_proj.controller.dto.LoginRequest;
import com.cart.ecom_proj.controller.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Сервис для аутентификации и регистрации пользователей.
 * Реализует бизнес-логику создания пользователя и выдачи JWT-токена.
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    /**
     * Репозиторий пользователей.
     */
    private final UserRepository userRepository;
    /**
     * Сервис для работы с JWT-токенами.
     */
    private final JwtService jwtService;
    /**
     * Кодировщик паролей.
     */
    private final PasswordEncoder passwordEncoder;
    /**
     * Менеджер аутентификации.
     */
    private final AuthenticationManager authenticationManager;

    /**
     * Регистрация нового пользователя.
     * @param request данные для регистрации
     * @return ответ с JWT-токеном
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByLogin(request.getLogin()).isPresent()) {
            throw new IllegalArgumentException("Login already exists");
        }
        var user = User.builder()
                .login(request.getLogin())
                .hashPassword(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Аутентификация пользователя (логин).
     * @param request данные для входа
     * @return ответ с JWT-токеном
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login or password"));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}