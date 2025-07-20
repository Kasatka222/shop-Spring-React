package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Репозиторий для работы с сущностью Product.
 * Предоставляет стандартные CRUD-операции и кастомный поиск.
 */
@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    /**
     * Поиск продуктов по ключевому слову (название, описание, бренд, категория).
     * @param keyword ключевое слово для поиска
     * @return список найденных продуктов
     */
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);
}
