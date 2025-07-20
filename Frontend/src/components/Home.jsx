import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, removeFromCart, cart } = useContext(AppContext);
  const [productsWithImages, setProductsWithImages] = useState([]);
  const imageCache = React.useRef({});

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        // If cart is empty, clear image cache to force reload after checkout
        if (cart.length === 0) {
          imageCache.current = {};
        }
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            if (imageCache.current[product.id]) {
              return { ...product, imageUrl: imageCache.current[product.id] };
            }
            try {
              const response = await axios.get(
                `/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              imageCache.current[product.id] = imageUrl;
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProductsWithImages(updatedProducts);
      };
      fetchImagesAndUpdateProducts();
    }
  }, [data, cart]);

  // Фильтрация продуктов по категории
  const filteredProducts = selectedCategory
    ? productsWithImages.filter((product) => product.category === selectedCategory)
    : productsWithImages;

  if (isError) {
    return (
      <div className="text-center" style={{ padding: "8rem" }}>
        <img src={unplugged} alt="Ошибка" style={{ width: '100px', height: '100px' }}/>
        <div style={{marginTop: '1rem', fontSize: '1.2rem'}}>Ошибка загрузки моделей</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center" style={{marginTop: '120px', marginBottom: '40px'}}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative'
        }}>
          <h1 style={{
            fontWeight: 800, 
            fontSize: '3rem', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem'
          }}>
            ✈️ AeroModels — коллекционные модели самолетов
          </h1>
          <p style={{
            fontSize: '1.3rem', 
            color: '#333', 
            lineHeight: '1.8',
            fontWeight: '500',
            margin: 0,
            textAlign: 'center'
          }}>
            Добро пожаловать в наш специализированный магазин! Здесь вы найдёте высококачественные коллекционные модели самолетов. 
            Точная детализация, историческая достоверность и страсть к авиации в каждой модели! ✨
          </p>
        </div>
      </div>
      <div
        className="grid"
        style={{
          marginTop: "80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
          padding: "24px",
          alignItems: "start"
        }}
      >
        {filteredProducts.length === 0 ? (
          <div
            className="text-center"
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: '#666',
              fontWeight: 500,
              fontSize: '1.4rem',
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{fontSize: '4rem', marginBottom: '1rem'}}>✈️</span>
            <span>Нет доступных моделей</span>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const { id, name, price, productAvailable, imageUrl } = product;
            // Count quantity in cart
            const cartItem = cart.find((item) => item.id === id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            
            return (
              <div
                className="card mb-0"
                style={{
                  width: "100%",
                  height: "580px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  overflow: "hidden", 
                  background: productAvailable 
                    ? "linear-gradient(145deg, #ffffff, #f8f9fa)" 
                    : "linear-gradient(145deg, #f5f5f5, #e8e8e8)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  position: "relative",
                }}
                key={id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
                }}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}
                >
                  {/* Изображение товара */}
                  <div style={{ flex: "0 0 auto" }}>
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",  
                        padding: "12px",
                        margin: "0",
                        borderRadius: "20px", 
                        background: '#fafafa',
                        transition: "all 0.3s ease",
                      }}
                      onError={(e) => {
                        e.target.src = unplugged;
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  </div>

                  {/* Контент карточки */}
                  <div
                    className="card-body"
                    style={{
                      flex: "1 1 auto",
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* Информация о товаре */}
                    <div style={{ flex: "0 0 auto" }}>
                      <h5
                        className="card-title"
                        style={{ 
                          margin: "0 0 8px 0", 
                          fontSize: "1.25rem", 
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #2c3e50, #3498db)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          lineHeight: "1.0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: "65px"
                        }}
                      >
                        {name}
                      </h5>
                    </div>
                    
                    {/* Цена и кнопки */}
                    <div style={{ flex: "0 0 auto" }}>
                      <hr className="hr-line" style={{ margin: "12px 0" }} />
                      <div className="home-cart-price" style={{marginBottom:'12px'}}>
                        <span style={{ 
                          fontWeight: "700", 
                          fontSize: "1.3rem",
                          background: "linear-gradient(135deg, #3498db, #2980b9)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          {price} ₽
                        </span>
                      </div>
                      <div style={{margin:'0'}}>
                      {productAvailable ? (
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
                              onClick={e => {
                                e.preventDefault();
                                // Decrement by 1, remove only if quantity becomes 1
                                if (quantityInCart > 1) {
                                  removeFromCart(product.id, 1);
                                } else if (quantityInCart === 1) {
                                  removeFromCart(product.id);
                                }
                              }}
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
                              onClick={e => {
                                e.preventDefault();
                                addToCart(product);
                              }}
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
                          (product.stockQuantity === 0 ? (
                            <div style={{
                              color:'#e74c3c', 
                              fontWeight:600, 
                              fontSize:'1.1rem', 
                              textAlign:'center', 
                              padding:'12px 0',
                              background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(192, 57, 43, 0.1))',
                              borderRadius: '12px',
                              border: '2px solid rgba(231, 76, 60, 0.3)'
                            }}>
                              😿 Модель закончилась
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
                              onClick={e => {
                                e.preventDefault();
                                addToCart(product);
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                              }}
                            >🛒 В корзину</button>
                          ))
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
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;
