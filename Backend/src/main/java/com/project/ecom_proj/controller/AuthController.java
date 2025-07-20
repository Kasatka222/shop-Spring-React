package com.cart.ecom_proj.controller;



import com.cart.ecom_proj.service.AuthService;
import com.cart.ecom_proj.controller.dto.AuthResponse;
import com.cart.ecom_proj.controller.dto.RegisterRequest;
import com.cart.ecom_proj.controller.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;

/**
 * Контроллер для аутентификации и регистрации пользователей.
 * Предоставляет API для регистрации и входа.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /**
     * Сервис для обработки логики аутентификации.
     */
    private final AuthService authService;

    /**
     * Регистрация нового пользователя.
     * @param request данные для регистрации
     * @return JWT-токен
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Аутентификация пользователя (логин).
     * @param request данные для входа
     * @return JWT-токен
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}