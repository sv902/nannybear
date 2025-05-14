import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axiosConfig";

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    const loginAndRedirect = async () => {
      const urlEmail = getQueryParam("email");
      const urlRole = getQueryParam("role");

      const email = urlEmail || localStorage.getItem("email") || sessionStorage.getItem("email");
      const password = localStorage.getItem("password") || sessionStorage.getItem("password");
      const role = urlRole || localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

      if (!email || !password || !role) {
        alert("Дані для входу не знайдені. Будь ласка, зареєструйтесь ще раз.");
        navigate("/registration");
        return;
      }

      try {
        await axios.get("/sanctum/csrf-cookie", { withCredentials: true });

        const loginResponse = await axios.post(
          "/api/login",
          { email, password },
          { withCredentials: true }
        );

        console.log("✅ Успішний логін:", loginResponse.data);

        const token = loginResponse?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        localStorage.removeItem("parentFormData");
        localStorage.removeItem("nannyFormData");
        localStorage.removeItem("surveyData");

        localStorage.setItem("justLoggedIn", "true");

        if (role === "parent") {
          localStorage.setItem("lastVisited", "/registration/parent/profile");
          navigate("/registration/parent/profile");
        } else if (role === "nanny") {
          localStorage.setItem("lastVisited", "/registration/nanny/profile");
          navigate("/registration/nanny/profile");
        } else {
          navigate("/");
        }

      } catch (error) {
        console.error("❌ Помилка при логіні після підтвердження email:", error.response || error.message);
        alert("Не вдалося увійти. Спробуйте ще раз.");
        navigate("/registration");
      } finally {
        setLoading(false);
      }
    };

    loginAndRedirect();
  }, [navigate, location]);

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
