import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
import { jwtDecode } from "jwt-decode";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  // Получаем роль из JWT токена
  let userRole = null;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log('decoded JWT:', decoded);
      console.log('JWT keys:', Object.keys(decoded));
      for (const key in decoded) {
        console.log(`JWT field [${key}]:`, decoded[key]);
      }
      // Попробуем все варианты
      if (decoded.role) {
        userRole = decoded.role;
      } else if (decoded.authorities) {
        if (Array.isArray(decoded.authorities)) {
          // authorities может быть массивом строк или объектов
          for (const a of decoded.authorities) {
            if (typeof a === 'string' && a.toUpperCase().includes('ADMIN')) {
              userRole = a;
              break;
            }
            if (typeof a === 'object' && a.authority && a.authority.toUpperCase().includes('ADMIN')) {
              userRole = a.authority;
              break;
            }
          }
          // если не нашли ADMIN, берём первый
          if (!userRole) {
            if (typeof decoded.authorities[0] === 'string') userRole = decoded.authorities[0];
            if (typeof decoded.authorities[0] === 'object' && decoded.authorities[0].authority) userRole = decoded.authorities[0].authority;
          }
        } else if (typeof decoded.authorities === 'string') {
          userRole = decoded.authorities;
        }
      } else if (decoded.authority) {
        userRole = decoded.authority;
      } else if (decoded.roles) {
        // иногда роли лежат в roles
        if (Array.isArray(decoded.roles)) {
          userRole = decoded.roles.find(r => r.toUpperCase().includes('ADMIN')) || decoded.roles[0];
        } else if (typeof decoded.roles === 'string') {
          userRole = decoded.roles;
        }
      }
    }
  } catch (e) {
    userRole = null;
  }
  console.log('userRole from JWT:', userRole);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  // Count quantity in cart (safe for initial render)
  const cartItem = product ? cart.find((item) => item.id === product.id) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const handleAddToCart = () => {
    if (product) addToCart(product);
  };
  const handleRemoveFromCart = () => {
    if (product) {
      // Always decrement by 1, remove only if quantity becomes 0
      removeFromCart(product.id, 1);
    }
  };
  if (!product) {
    return (
      <div className="text-center" style={{ padding: "8rem" }}>
        Загрузка модели...
      </div>
    );
  }
  // Категории: value -> description
  const categoryMap = {
    fighter: "Истребители",
    bomber: "Бомбардировщики", 
    civilian: "Гражданская авиация",
    military: "Военные самолеты",
    vintage: "Винтажные модели",
    modern: "Современные самолеты",
    helicopter: "Вертолеты",
    other: "Другие модели"
  };
  const categoryDescription = categoryMap[product.category] || product.category;
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
        maxWidth: "700px", 
        width: "100%", 
        borderRadius: "24px", 
        background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(20px)"
      }}>
        <div className="d-flex flex-column align-items-center">
          <img
            src={imageUrl}
            alt={product.imageName}
            style={{ 
              maxWidth: "100%", 
              maxHeight: "300px", 
              borderRadius: "20px", 
              boxShadow: "0 15px 35px rgba(0,0,0,0.15)", 
              marginBottom: "2rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 20px 50px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
            }}
          />
          <div className="mb-2" style={{ color: '#444', fontSize: '1rem', alignSelf: 'flex-start' }}>{categoryDescription}</div>
          <div className="mb-2" style={{ fontSize: '0.95rem', color: '#555', alignSelf: 'flex-start' }}>
            Дата добавления: <span style={{ fontStyle: 'italic', color: '#222' }}>{new Date(product.releaseDate).toLocaleDateString()}</span>
          </div>
          <h2 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "0.8rem", 
            fontWeight: 700,
            background: "linear-gradient(135deg, #2c3e50, #3498db)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            alignSelf: 'flex-start' 
          }}>{product.name}</h2>
          <div style={{ 
            marginBottom: "1.5rem", 
            fontStyle: 'italic', 
            color: '#666', 
            alignSelf: 'flex-start',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>{product.brand}</div>
          <div className="mb-3" style={{ 
            fontWeight: 600, 
            fontSize: '1.2rem', 
            color: '#555', 
            alignSelf: 'flex-start' 
          }}>📝 Описание модели:</div>
          <div className="mb-4 w-100" style={{ 
            color: '#333', 
            fontSize: '1.1rem', 
            background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)', 
            borderRadius: '16px', 
            padding: '20px 24px', 
            alignSelf: 'flex-start',
            lineHeight: '1.6',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>{product.description}</div>
          <div className="mb-4 w-100" style={{ 
            fontSize: '1.8rem', 
            fontWeight: 800,
            background: "linear-gradient(135deg, #3498db, #2980b9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            alignSelf: 'flex-start' 
          }}>
            💰 {product.price} ₽
          </div>
          <div className="w-100 mb-3">
            {product.productAvailable ? (
              quantityInCart > 0 ? (
                <div className="d-flex align-items-center justify-content-between" style={{gap:'10px'}}>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    style={{
                      fontWeight:600, 
                      fontSize:'1rem', 
                      borderRadius:'12px', 
                      minWidth:'42px',
                      height: '42px',
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleRemoveFromCart}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
                    }}
                    disabled={quantityInCart === 0}
                  >-</button>
                  <span style={{
                    fontWeight:700, 
                    fontSize:'1.2rem', 
                    minWidth:'36px', 
                    textAlign:'center',
                    color: '#2c3e50',
                    background: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}>{quantityInCart}</span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    style={{
                      fontWeight:600, 
                      fontSize:'1rem', 
                      borderRadius:'12px', 
                      minWidth:'42px',
                      height: '42px',
                      background: 'linear-gradient(135deg, #3498db, #2980b9)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleAddToCart}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                    }}
                    disabled={quantityInCart >= product.stockQuantity}
                  >+</button>
                </div>
              ) : (
                <button
                  className="btn btn-outline-primary w-100"
                  style={{
                    fontWeight:600, 
                    fontSize:'1.1rem', 
                    borderRadius:'12px',
                    padding: '12px 0',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleAddToCart}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                  }}
                  disabled={product.stockQuantity === 0}
                >🛒 Добавить в корзину</button>
              )
            ) : (
              <button 
                className="btn btn-outline-secondary w-100" 
                style={{
                  fontWeight:600, 
                  fontSize:'1.1rem', 
                  borderRadius:'12px',
                  padding: '12px 0',
                  background: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                  color: 'white',
                  border: 'none',
                  cursor: 'not-allowed'
                }} 
                disabled
              >
                ❌ Нет в наличии
              </button>
            )}
          </div>
          <div className="mb-3 w-100" style={{ fontSize: '1rem', color: '#222', alignSelf: 'flex-start' }}>
            Остаток на складе: <span style={{ color: 'green', fontWeight: 600 }}>{product.stockQuantity}</span>
          </div>
          {(userRole && userRole.toUpperCase() === "ADMIN") && (
            <div className="d-flex gap-3 w-100 mt-2">
              <button
                className="btn btn-primary flex-fill"
                type="button"
                onClick={handleEditClick}
                style={{ 
                  fontSize: '1rem', 
                  borderRadius: '12px', 
                  padding: '12px 0', 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                }}
              >
                ✏️ Редактировать
              </button>
              <button
                className="btn btn-danger flex-fill"
                type="button"
                onClick={deleteProduct}
                style={{ 
                  fontSize: '1rem', 
                  borderRadius: '12px', 
                  padding: '12px 0', 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(231, 76, 60, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
                }}
              >
                🗑️ Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;