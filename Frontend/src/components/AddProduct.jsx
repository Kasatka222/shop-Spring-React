import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

  
const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // setProduct({...product, image: e.target.files[0]})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Модель успешно добавлена:", response.data);
        alert("Модель успешно добавлена!");
        navigate("/products");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Ошибка при добавлении модели:", error);
        alert("Ошибка при добавлении модели!");
      });
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto"
    }}>
      <div className="card shadow-lg p-4" style={{ 
        maxWidth: "420px", 
        width: "100%", 
        borderRadius: "24px", 
        background: "linear-gradient(145deg, #ffffff, #f8f9fa)", 
        maxHeight: "95vh", 
        overflowY: "auto",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(20px)"
      }}>
        <h2 className="mb-4 text-center" style={{ 
          fontWeight: 700, 
          fontSize: "1.8rem",
          background: "linear-gradient(135deg, #3498db, #9b59b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>            ✈️ Добавить модель</h2>
        <form onSubmit={submitHandler} autoComplete="off">
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Название модели</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Введите название модели самолета"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Производитель</label>
            <input
              type="text"
              name="brand"
              className="form-control form-control-sm"
              placeholder="Введите производителя модели"
              value={product.brand}
              onChange={handleInputChange}
              id="brand"
              required
              minLength={2}
              maxLength={30}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Описание</label>
            <textarea
              className="form-control form-control-sm"
              placeholder="Введите описание модели самолета"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
              rows={2}
              required
              minLength={5}
              maxLength={200}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Цена (₽)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Например: 1000"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              id="price"
              required
              min={0}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Категория</label>
            <select
              className="form-select form-select-sm"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              id="category"
              required
            >
              <option value="">Выберите категорию</option>
              <option value="fighter">Истребители</option>
              <option value="bomber">Бомбардировщики</option>
              <option value="civilian">Гражданская авиация</option>
              <option value="military">Военные самолеты</option>
              <option value="vintage">Винтажные модели</option>
              <option value="modern">Современные самолеты</option>
              <option value="helicopter">Вертолеты</option>
              <option value="other">Другие модели</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Количество на складе</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Остаток на складе"
              onChange={handleInputChange}
              value={product.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
              required
              min={0}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Дата выхода</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
              id="releaseDate"
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Изображение</label>
            <input
              className="form-control form-control-sm"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              id="gridCheck"
              checked={product.productAvailable}
              onChange={(e) =>
                setProduct({ ...product, productAvailable: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="gridCheck" style={{ fontSize: "0.95rem" }}>Модель доступна</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            style={{ 
              fontSize: '1.1rem', 
              borderRadius: '16px', 
              padding: '14px 0', 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3498db, #2980b9)',
              border: 'none',
              boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 35px rgba(52, 152, 219, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.3)";
            }}
          >
            ✈️ Добавить модель
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
