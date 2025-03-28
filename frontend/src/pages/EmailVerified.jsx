// src/pages/EmailVerified.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginAndRedirect = async () => {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      const role = localStorage.getItem("userRole");

      if (!email || !password || !role) {
        alert("Дані для входу не знайдені. Будь ласка, зареєструйтесь ще раз.");
        navigate("/registration");
        return;
      }

      try {
        // Отримуємо CSRF-cookie
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

        // Логін
        const loginResponse = await axios.post(
          '/api/login',
          { email, password },
          { withCredentials: true }
        );
     
        // Зберігаємо токен у localStorage (на випадок подальшого використання)
        const token = loginResponse?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
        }

        // Перенаправлення згідно з роллю
        if (role === "parent") {
          window.location.replace("/registration/parent/profile");
        } else if (role === "nanny") {
          window.location.replace("/registration/nanny/profile");
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("❌ Помилка при логіні після підтвердження email:", error.response || error.message);
        alert("Не вдалося увійти. Можливо, email ще не підтверджено або сесія втрачена.");
        navigate("/registration");
      }
    };

    loginAndRedirect();
  }, [navigate]);

  return (
    <div className="email-confirmation-container">
      <h1 className="title-light-full-page">Очікуємо підтвердження...</h1>
      <p className="description-light">
      Будь ласка, зачекайте кілька секунд. Ми вас авторизуємо та перенаправимо...
      </p>
    </div>
  );
};

export default EmailVerified;
