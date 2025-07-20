package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Репозиторий для работы с сущностью User.
 * Предоставляет стандартные CRUD-операции и поиск по логину.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    /**
     * Поиск пользователя по логину.
     * @param login логин пользователя
     * @return Optional с найденным пользователем
     */
    Optional<User> findByLogin(String login);
}