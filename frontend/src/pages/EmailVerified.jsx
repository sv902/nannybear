import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const EmailVerified = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginAndRedirect = async () => {
      const email =
  localStorage.getItem("email") || sessionStorage.getItem("email");
const password =
  localStorage.getItem("password") || sessionStorage.getItem("password");
const role =
  localStorage.getItem("userRole") || sessionStorage.getItem("userRole");


      if (!email || !password || !role) {
        alert("Дані для входу не знайдені. Будь ласка, зареєструйтесь ще раз.");
        navigate("/registration");
        return;
      }

      try {
        // Отримуємо CSRF cookie (для Sanctum)
        await axios.get("/sanctum/csrf-cookie", { withCredentials: true });

        // Логін
        const loginResponse = await axios.post(
          "/api/login",
          { email, password },
          { withCredentials: true }
        );

        console.log("✅ Успішний логін:", loginResponse.data);

        localStorage.removeItem("parentFormData");
        localStorage.removeItem("nannyFormData");
        localStorage.removeItem("surveyData");

        // Зберігаємо токен для подальшого використання
        const token = loginResponse?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        // Позначаємо, що користувач тільки що увійшов (для профілю)
        localStorage.setItem("justLoggedIn", "true");

        // ❗ НЕ видаляємо formData (щоб не стерти введене)
        // localStorage.removeItem("parentFormData"); — не потрібно

        // 🔀 Перенаправлення згідно з роллю
        if (role === "parent") {
          navigate("/registration/parent/profile");
          localStorage.setItem("lastVisited", "/registration/parent/profile");
        } else if (role === "nanny") {
          navigate("/registration/nanny/profile");
          localStorage.setItem("lastVisited", "/registration/nanny/profile");
        } else {
          navigate("/");
        }        

        // ✅ Тепер можна стерти логін-дані
        // localStorage.removeItem("email");
        // localStorage.removeItem("password");
        // localStorage.removeItem("userRole");

      } catch (error) {
        console.error("❌ Помилка при логіні після підтвердження email:", error.response || error.message);
        alert("Не вдалося увійти. Спробуйте ще раз.");
        navigate("/registration");
      } finally {
        setLoading(false);
      }
    };

    loginAndRedirect();
  }, [navigate]);

  return (
    <div className="email-confirmation-container">
      <h1 className="title-light-full-page">Очікуємо підтвердження...</h1>
      <p className="description-light">
        {loading
          ? "Будь ласка, зачекайте кілька секунд. Ми вас авторизуємо та перенаправимо..."
          : "Спробуйте перезавантажити сторінку або увійти ще раз."}
      </p>
    </div>
  );
};

export default EmailVerified;
