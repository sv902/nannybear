import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import LoginButton from "../components/Login/LoginButton";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Register/RegisterForm";
import RegisterButton from "../components/Register/RegisterButton";
import "../styles/register.css";

const RegistrationLogin = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("login"); // За замовчуванням "Вхід"

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section === "register" || section === "login") {
      setActiveSection(section);
    }
  }, [location.search]); // Оновлюємо при зміні URL

  return (
    <div className="registration-container">
      {/* Ліва частина (Вхід) */}
      <div className={`left-side ${activeSection === "login" ? "active" : ""}`}>
        {activeSection === "login" ? (
          <LoginForm />
        ) : (
          <LoginButton onClick={() => setActiveSection("login")} />
        )}
      </div>

      <div className="ears1">
        <div className="ear1 left-ear1"></div>
        <div className="ear1 right-ear1"></div>
      </div>

      <div className="ears2">
        <div className="ear2 left-ear2"></div>
        <div className="ear2 right-ear2"></div>
      </div>

      {/* Права частина (Реєстрація) */}
      <div className={`right-side ${activeSection === "register" ? "active" : ""}`}>
        {activeSection === "register" ? (
          <RegisterForm />
        ) : (
          <RegisterButton onClick={() => setActiveSection("register")} />
        )}
      </div>
    </div>
  );
};

export default RegistrationLogin;
