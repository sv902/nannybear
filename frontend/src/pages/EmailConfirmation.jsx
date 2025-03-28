import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/register.css";

const EmailConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();  
    
    const email = location.state?.email;

    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/registrationlogin");
      }, 2000); // автоматичний перехід через 2 секунди
  
      return () => clearTimeout(timer); // очищення таймера при розмонтажі
    }, [navigate]);

  return (
    <div className="email-confirmation-container">
    <button onClick={() => navigate(-1)} className="back-button">
      <span className="back-text">НАЗАД</span>
      <span className="back-arrow"></span>
    </button>
      <h1 className="title-light-full-page">Підтвердження пошти</h1>
      <p className="description-light">
        На вашу поштову скриньку <strong>{email}</strong> надійшло повідомлення.<br />
        Будь ласка, перейдіть по посиланню, аби підтвердити Вашу <br /> електронну адресу та продовжити реєстрацію.
      </p>
    </div>
  );
};

export default EmailConfirmation;
