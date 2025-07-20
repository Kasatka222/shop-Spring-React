package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Сервис для управления продуктами.
 * Реализует бизнес-логику CRUD-операций и работу с изображениями.
 */
@Service
public class ProductService {

    /**
     * Репозиторий для доступа к данным продуктов.
     */
    @Autowired
    private ProductRepo repo;

    /**
     * Получить все продукты.
     * @return список всех продуктов
     */
    @Transactional
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    /**
     * Получить продукт по идентификатору.
     * @param id идентификатор продукта
     * @return продукт или null, если не найден
     */
    @Transactional
    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    /**
     * Добавить новый продукт с изображением.
     * @param product объект продукта
     * @param imageFile файл изображения
     * @return сохранённый продукт
     * @throws IOException ошибка при обработке файла
     */
    @Transactional
    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    /**
     * Обновить продукт, при необходимости обновить изображение.
     * @param id идентификатор продукта
     * @param product обновлённый объект продукта
     * @param imageFile новый файл изображения (может быть null)
     * @return обновлённый продукт
     * @throws IOException ошибка при обработке файла
     */
    @Transactional
    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageDate(imageFile.getBytes());
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
        } else {
            Product existingProduct = repo.findById(id).orElse(null);
            if (existingProduct != null) {
                product.setImageDate(existingProduct.getImageDate());
                product.setImageName(existingProduct.getImageName());
                product.setImageType(existingProduct.getImageType());
            }
        }
        return repo.save(product);
    }

    /**
     * Удалить продукт по идентификатору.
     * @param id идентификатор продукта
     */
    @Transactional
    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    /**
     * Поиск продуктов по ключевому слову.
     * @param keyword ключевое слово для поиска
     * @return список найденных продуктов
     */
    @Transactional
    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
