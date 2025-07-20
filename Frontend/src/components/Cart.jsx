


import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart , clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        console.log("cart",cart)
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };
  

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
  
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData)
  
        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );
  
        await axios
          .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
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
        maxWidth: "800px", 
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
          fontSize: "2rem",
          background: "linear-gradient(135deg, #3498db, #9b59b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>🛒 Корзина покупок</h2>
        {cartItems.length === 0 ? (
          <div className="text-center" style={{ 
            color: '#666', 
            fontSize: '1.3rem', 
            margin: '3rem 0',
            background: 'rgba(52, 152, 219, 0.1)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px dashed rgba(52, 152, 219, 0.3)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <div>Ваша корзина пуста</div>
            <div style={{ fontSize: '1rem', marginTop: '0.5rem', color: '#888' }}>
              Добавьте модели для продолжения покупок
            </div>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item mb-3" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)', 
                borderRadius: '16px', 
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)', 
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
              }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover', 
                    borderRadius: '12px', 
                    marginRight: '20px', 
                    background: '#fafafa',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '1.2rem', 
                    marginBottom: '4px',
                    background: "linear-gradient(135deg, #2c3e50, #3498db)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>{item.name}</div>
                  <div style={{ fontSize: '1rem', color: '#666', fontWeight: '500' }}>{item.brand}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '15px' }}>
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    type="button" 
                    onClick={() => handleDecreaseQuantity(item.id)} 
                    style={{ 
                      borderRadius: '50%', 
                      padding: '8px 12px',
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
                    }}
                  >-</button>
                  <span style={{ 
                    minWidth: '30px', 
                    textAlign: 'center', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    background: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#2c3e50',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}>{item.quantity}</span>
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    type="button" 
                    onClick={() => handleIncreaseQuantity(item.id)} 
                    style={{ 
                      borderRadius: '50%', 
                      padding: '8px 12px',
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #3498db, #2980b9)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
                    }}
                  >+</button>
                </div>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '1.2rem', 
                  marginRight: '15px', 
                  minWidth: '80px', 
                  textAlign: 'right',
                  background: "linear-gradient(135deg, #3498db, #2980b9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{item.price * item.quantity} ₽</div>
                <button 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={() => handleRemoveFromCart(item.id)} 
                  style={{ 
                    borderRadius: '50%', 
                    padding: '8px 12px',
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
                  }}
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </div>
            ))}
            <div className="total text-center" style={{ 
              fontWeight: 800, 
              fontSize: '1.5rem', 
              margin: '2rem 0 1.5rem 0',
              background: "linear-gradient(135deg, #3498db, #2980b9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              padding: '1rem',
              borderRadius: '12px',
              border: '2px solid rgba(52, 152, 219, 0.2)'
            }}>💰 Итого: {totalPrice} ₽</div>
            <Button
              className="btn btn-primary w-100 mt-3"
              style={{ 
                fontSize: '1.2rem', 
                borderRadius: '16px', 
                padding: '16px 0', 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                border: 'none',
                boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
                transition: 'all 0.4s ease'
              }}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 35px rgba(52, 152, 219, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(52, 152, 219, 0.3)";
              }}
            >
              🎉 Оформить заказ
            </Button>
          </>
        )}
        <CheckoutPopup
          show={showModal}
          handleClose={() => setShowModal(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          handleCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;
