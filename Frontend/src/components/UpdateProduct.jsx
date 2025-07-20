import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(response.data);
      
        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
       const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
        setImage(imageFile);     
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);



  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("images", image)
    console.log("productsdfsfsf", updateProduct)
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );
  

  console.log("formData : ", updatedProduct)
    axios
      .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", updatedProduct);
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        console.log("product unsuccessfull update",updateProduct)
        alert("Failed to update product. Please try again.");
      });
  };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
        maxWidth: "450px", 
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
          background: "linear-gradient(135deg, #e67e22, #f39c12)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>✏️ Редактировать модель</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Название модели</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Бренд</label>
            <input
              type="text"
              name="brand"
              className="form-control form-control-sm"
              placeholder={product.brand}
              value={updateProduct.brand}
              onChange={handleChange}
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
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
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
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
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
              value={updateProduct.category}
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder={product.stockQuantity}
              value={updateProduct.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
              required
              min={0}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={{ fontSize: "0.95rem" }}>Изображение</label>
            <div className="mb-2 text-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt={product.imageName}
                  style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
                />
              ) : (
                <div style={{ color: '#888', fontSize: '0.95rem' }}>Нет изображения</div>
              )}
            </div>
            <input
              className="form-control form-control-sm"
              type="file"
              onChange={handleImageChange}
              placeholder="Загрузить изображение модели"
              name="imageUrl"
              id="imageUrl"
              accept="image/*"
            />
          </div>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              id="gridCheck"
              checked={updateProduct.productAvailable}
              onChange={(e) =>
                setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="gridCheck" style={{ fontSize: "0.95rem" }}>Модель доступна</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3" style={{ 
            fontSize: '1.1rem', 
            borderRadius: '16px', 
            padding: '14px 0', 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #e67e22, #f39c12)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(230, 126, 34, 0.3)',
            transition: 'all 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 35px rgba(230, 126, 34, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 25px rgba(230, 126, 34, 0.3)";
          }}>
            💾 Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;