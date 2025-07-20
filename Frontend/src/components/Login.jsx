import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.post("/auth/login", {
        login,
        password,
      });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess("Вход выполнен успешно!");
        if (onLogin) {
          onLogin();
        }
        setTimeout(() => {
          navigate("/"); // Always redirect to root
        }, 1000);
      } else {
        setError("Неверные данные для входа");
      }
    } catch (err) {
      setError(err.response?.data || "Ошибка авторизации. Проверьте логин и пароль.");
    } finally {
      setLoading(false);
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
      bottom: 0
    }}>
      <div className="card shadow-lg p-4" style={{ 
        maxWidth: 400, 
        width: "100%",
        borderRadius: "20px",
        border: "none",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
      }}>
        <h2 className="mb-4 text-center" style={{
          fontWeight: 700,
          fontSize: "2rem",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>🚪 Вход</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Логин</label>
            <input
              type="text"
              className="form-control"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder="Логин"
              autoFocus
              style={{
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600', color: '#333' }}>Пароль</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Пароль"
              style={{
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                padding: '12px 16px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid #e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}
          <button type="submit" className="btn w-100" disabled={loading} style={{
            fontSize: '1.1rem',
            borderRadius: '16px',
            padding: '14px 0',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.4s ease',
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }
          }}>
            {loading ? "🔄 Вход..." : "🚪 Войти"}
          </button>
        </form>
        <div className="mt-3 text-center">
          <span style={{ color: '#666' }}>Нет аккаунта? </span>
          <a href="/register" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#764ba2';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#667eea';
            e.target.style.textDecoration = 'none';
          }}>
            Зарегистрироваться
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;