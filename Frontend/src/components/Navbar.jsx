import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
import { useLocation } from "react-router-dom";
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";

const Navbar = ({ onSelectCategory, onSearch, userRole }) => {
  // Функция выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const location = useLocation();
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  
  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        padding: '1rem 0'
      }}>
        <div className="container-fluid">
          {/* navbar-brand удалён по запросу */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Открыть навигацию"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '8px 12px'
            }}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/" style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  🏠 Главная
                </a>
              </li>
              {userRole === "ADMIN" && (
                <li className="nav-item">
                  <a className="nav-link" href="/add_product" style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    marginLeft: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    ➕ Добавить модель
                  </a>
                </li>
              )}
              {/* Выпадающий список категорий удалён */}
              <li className="nav-item"></li>
            </ul>
            <div className="d-flex justify-content-end align-items-center" style={{minWidth: '180px'}}>
              <button className="btn" style={{
                marginLeft: '60px', 
                border: 'none',
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
                transition: 'all 0.3s ease'
              }} 
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
              }}>
                🚪 Выйти
              </button>
            </div>
            <div className="d-flex align-items-center cart">
              <a href="/cart" className="nav-link" style={{
                color: 'white',
                fontWeight: '600',
                fontSize: '1.1rem',
                padding: '8px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}>
                🛒 Корзина
              </a>
              {/* <form className="d-flex" role="search" onSubmit={handleSearch} id="searchForm"> */}
              <div style={{ position: 'relative' }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="🔍 Поиск моделей..."
                aria-label="Поиск моделей"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '10px 16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onFocusCapture={(e) => {
                  e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
                  e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.15)';
                }}
                onBlurCapture={(e) => {
                  e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              />
              {showSearchResults && (
                <ul className="list-group" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  marginTop: '8px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                  {searchResults.length > 0 ? (  
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item" style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}>
                          <a href={`/product/${result.id}`} className="search-result-link" style={{
                            textDecoration: 'none',
                            color: '#333',
                            fontWeight: '500',
                            display: 'block'
                          }}>
                          <span>✈️ {result.name}</span>
                          </a>
                        </li>
                      ))
                  ) : (
                    noResults && (
                      <p className="no-results-message" style={{
                        padding: '16px',
                        margin: 0,
                        color: '#666',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        😔 Модель с таким названием не найдена
                      </p>
                    )
                  )}
                </ul>
              )}
              </div>
              {/* <button
                className="btn btn-outline-success"
                onClick={handleSearch}
              >
                Найти модель
              </button> */}
              {/* </form> */}
              {/* удалён лишний <div /> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
