import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно для заполнения';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен';
    } else if (!/^[\+]?[0-9\-\(\)\s]{10,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Адрес доставки обязателен';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleCheckout(customerInfo);
    }
  };

  const handleCloseModal = () => {
    setCustomerInfo({ fullName: '', phone: '', address: '' });
    setErrors({});
    handleClose();
  };
  return (
    <div className="checkoutPopup">
      <Modal show={show} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          borderBottom: 'none',
          color: 'white',
          borderRadius: '16px 16px 0 0'
        }}>
          <Modal.Title style={{ 
            fontWeight: 700, 
            fontSize: '1.5rem',
            color: 'white'
          }}>🎉 Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)', 
          padding: '2rem',
          borderRadius: '0 0 16px 16px'
        }}>
          <div className="checkout-items">
            {cartItems.length === 0 ? (
              <div className="text-center" style={{ 
                color: '#666', 
                fontSize: '1.3rem', 
                margin: '2rem 0',
                background: 'rgba(52, 152, 219, 0.1)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px dashed rgba(52, 152, 219, 0.3)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                Корзина пуста
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="checkout-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '16px', 
                  background: 'linear-gradient(145deg, #ffffff, #f0f2f5)', 
                  borderRadius: '16px', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)', 
                  padding: '16px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="cart-item-image" 
                    style={{ 
                      width: '90px', 
                      height: '90px', 
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
                      fontSize: '1.1rem', 
                      marginBottom: '4px',
                      background: "linear-gradient(135deg, #2c3e50, #3498db)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>{item.name}</div>
                    <div style={{ fontSize: '1rem', color: '#666' }}>Количество: <b style={{ color: '#2c3e50' }}>{item.quantity}</b></div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #3498db, #2980b9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>Цена: {item.price * item.quantity} ₽</div>
                  </div>
                </div>
              ))
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ 
                fontWeight: 800, 
                fontSize: '1.6rem',
                background: "linear-gradient(135deg, #3498db, #2980b9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                padding: '1rem',
                border: '2px solid rgba(52, 152, 219, 0.2)',
                borderRadius: '12px',
                margin: '1rem 0'
              }}>
                💰 Итого: {totalPrice} ₽
              </div>
            </div>

            {/* Форма с информацией о заказчике */}
            <div style={{ 
              marginTop: '24px', 
              padding: '24px',
              background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <h5 style={{ 
                marginBottom: '20px',
                fontWeight: 700,
                background: "linear-gradient(135deg, #2c3e50, #3498db)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>📋 Информация о заказчике</h5>
              
              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#2c3e50' 
                }}>👤 ФИО *</label>
                <input
                  type="text"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Введите ваше полное имя"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: errors.fullName ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.fullName ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.fullName && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#2c3e50' 
                }}>📞 Номер телефона *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (900) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: errors.phone ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.phone ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.phone && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#2c3e50' 
                }}>🏠 Адрес доставки *</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Введите полный адрес доставки (город, улица, дом, квартира)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: errors.address ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = errors.address ? '2px solid #e74c3c' : '2px solid rgba(52, 152, 219, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.address && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ 
          background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)', 
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          padding: '1.5rem 2rem'
        }}>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal} 
            style={{ 
              borderRadius: '12px', 
              fontWeight: 600, 
              padding: '12px 24px', 
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(149, 165, 166, 0.3)'
            }}
          >
            ❌ Закрыть
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            style={{ 
              borderRadius: '12px', 
              fontWeight: 600, 
              padding: '12px 24px', 
              fontSize: '1rem',
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
            disabled={cartItems.length === 0}
          >
            🎉 Подтвердить покупку
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
