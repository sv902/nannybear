import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../axiosConfig.js';
import googleLogo from "../../assets/google-cirkle-icon.png";
import facebookLogo from "../../assets/facebook-cirkle-icon.png";
import eyeOpen from "../../icons/eye-open.png";
import eyeClosed from "../../icons/eye-closed.png";
import "../../styles/register.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const lastVisited = localStorage.getItem("lastVisited");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Будь ласка, введіть email та пароль.");
      return;
    }
  
    try {
      // Отримуємо CSRF cookie перед запитом на логін
      await axios.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`);
  
      // Запит на логін
      const response = await axios.post("/api/login", { email, password });
  
      if (response.data.token) {
        // Збереження токену в localStorage
        localStorage.setItem("authToken", response.data.token);
        console.log("Токен знайдено:", response.data.token);
        localStorage.setItem("email", email);
  
        // Додавання токену в заголовки для всіх подальших запитів
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  
        const userRole = response.data.user.role?.name;
  
        // 🎯 Редірект залежно від ролі
        if (userRole === "nanny") {
          return navigate("/nanny/profile");
        } else if (userRole === "parent") {
          return navigate("/nanny-profiles");
        } else if (userRole === "admin") {
          return navigate("/admin");
        } else {
          return navigate("/");
        }
      }
    } catch (err) {
      setError("Невірний email або пароль!");
    }
  };
     
  
  return (
    <div className="login-form-container">
      <h1 className="title-light">ВХІД В АКАУНТ</h1>
      <div className="social-btn">
        <button className="google-login-btn login-icon">
          <img src={googleLogo} alt="Google" />
        </button>
        <button className="facebook-login-btn login-icon">
          <img src={facebookLogo} alt="Facebook" />
        </button>
      </div>
      <p className="description-light">або</p>
    <form onSubmit={handleLogin}>
        <input
          className="login-form-input"
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
            <input
              className="input-field password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
              <img src={showPassword ? eyeOpen : eyeClosed} alt="toggle visibility" />
          </button>
        </div>

        {error && <p style={{ color: "#FFFAEE" }}>{error}</p>}

        <button className="login-form-button" type="submit">
          Увійти в акаунт
        </button>
        <p className="description-light">
          <a href="/forgot-password" style={{ color: "#FFFAEE", textDecoration: "underline" }}>
            Забули пароль?
          </a>
        </p>
    </form>     
    </div>
  );
};

export default LoginForm;
