package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Модель пользователя для системы аутентификации и авторизации.
 * Реализует интерфейс UserDetails для интеграции с Spring Security.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
    /**
     * Уникальный идентификатор пользователя.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;
    /**
     * Логин пользователя.
     */
    private String login;
    /**
     * Хэш пароля пользователя.
     */
    private String hashPassword;
    /**
     * Email пользователя.
     */
    private String email;
    /**
     * Фото профиля пользователя.
     */
    private String profilePhoto;
    /**
     * Роль пользователя (например, USER, ADMIN).
     */
    private String role;

    /**
     * Получить список прав пользователя для Spring Security.
     * @return коллекция GrantedAuthority
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    /**
     * Получить хэш пароля пользователя.
     * @return хэш пароля
     */
    @Override
    public String getPassword() {
        return hashPassword;
    }

    /**
     * Получить логин пользователя.
     * @return логин
     */
    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}