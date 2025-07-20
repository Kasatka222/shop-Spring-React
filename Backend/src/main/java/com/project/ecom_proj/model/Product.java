package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Модель продукта для интернет-магазина.
 * Содержит основные характеристики товара, включая изображение.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    /**
     * Уникальный идентификатор продукта.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    /**
     * Название продукта.
     */
    private String name;
    /**
     * Описание продукта.
     */
    private String description;
    /**
     * Бренд продукта.
     */
    private String brand;
    /**
     * Цена продукта.
     */
    private BigDecimal price;
    /**
     * Категория продукта.
     */
    private  String category;
    /**
     * Дата выхода продукта.
     */
    private Date releaseDate;
    /**
     * Доступность продукта.
     */
    private boolean productAvailable;
    /**
     * Количество на складе.
     */
    private int stockQuantity;
    /**
     * Имя файла изображения.
     */
    private String imageName;
    /**
     * MIME-тип изображения.
     */
    private String imageType;
    /**
     * Данные изображения в виде массива байт.
     */
    @Lob
    private byte[] imageDate;

    /**
     * Получить идентификатор продукта.
     * @return id продукта
     */
    public int getId() {
        return id;
    }

    /**
     * Установить идентификатор продукта.
     * @param id идентификатор
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Получить название продукта.
     * @return название
     */
    public String getName() {
        return name;
    }

    /**
     * Установить название продукта.
     * @param name название
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Получить описание продукта.
     * @return описание
     */
    public String getDescription() {
        return description;
    }

    /**
     * Установить описание продукта.
     * @param description описание
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Получить бренд продукта.
     * @return бренд
     */
    public String getBrand() {
        return brand;
    }

    /**
     * Установить бренд продукта.
     * @param brand бренд
     */
    public void setBrand(String brand) {
        this.brand = brand;
    }

    /**
     * Получить цену продукта.
     * @return цена
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * Установить цену продукта.
     * @param price цена
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * Получить категорию продукта.
     * @return категория
     */
    public String getCategory() {
        return category;
    }

    /**
     * Установить категорию продукта.
     * @param category категория
     */
    public void setCategory(String category) {
        this.category = category;
    }

    /**
     * Получить дату выхода продукта.
     * @return дата выхода
     */
    public Date getReleaseDate() {
        return releaseDate;
    }

    /**
     * Установить дату выхода продукта.
     * @param releaseDate дата выхода
     */
    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    /**
     * Проверить доступность продукта.
     * @return true, если продукт доступен; иначе false
     */
    public boolean isProductAvailable() {
        return productAvailable;
    }

    /**
     * Установить доступность продукта.
     * @param productAvailable доступность
     */
    public void setProductAvailable(boolean productAvailable) {
        this.productAvailable = productAvailable;
    }

    /**
     * Получить количество продукта на складе.
     * @return количество на складе
     */
    public int getStockQuantity() {
        return stockQuantity;
    }

    /**
     * Установить количество продукта на складе.
     * @param stockQuantity количество на складе
     */
    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    /**
     * Получить имя файла изображения.
     * @return имя файла изображения
     */
    public String getImageName() {
        return imageName;
    }

    /**
     * Установить имя файла изображения.
     * @param imageName имя файла изображения
     */
    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    /**
     * Получить MIME-тип изображения.
     * @return MIME-тип изображения
     */
    public String getImageType(String contentType) {
        return imageType;
    }

    /**
     * Установить MIME-тип изображения.
     * @param imageType MIME-тип изображения
     */
    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    /**
     * Получить данные изображения в виде массива байт.
     * @return данные изображения
     */
    public byte[] getImageDate() {
        return imageDate;
    }

    /**
     * Установить данные изображения в виде массива байт.
     * @param imageDate данные изображения
     */
    public void setImageDate(byte[] imageDate) {
        this.imageDate = imageDate;
    }
}
