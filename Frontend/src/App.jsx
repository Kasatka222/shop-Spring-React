import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || null);
      } catch {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [isAuthenticated]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || null);
      } catch {
        setUserRole(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent
          handleCategorySelect={handleCategorySelect}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          userRole={userRole}
          addToCart={addToCart}
          handleLogin={handleLogin}
          selectedCategory={selectedCategory}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

function AppContent({ handleCategorySelect, isAuthenticated, handleLogout, userRole, addToCart, handleLogin, selectedCategory }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar
          onSelectCategory={handleCategorySelect}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          userRole={userRole}
        />
      )}
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} selectedCategory={selectedCategory} />} />
        {userRole === "ADMIN" && (
          <Route 
            path="/add_product" 
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            } 
          />
        )}
        <Route 
          path="/product" 
          element={
            <PrivateRoute>
              <Product userRole={userRole} />
            </PrivateRoute>
          } 
        />
        <Route 
          path="product/:id" 
          element={
            <PrivateRoute>
              <Product userRole={userRole} />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/product/update/:id" 
          element={
            <PrivateRoute>
              <UpdateProduct />
            </PrivateRoute>
          } 
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
