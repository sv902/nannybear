// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import bearImg from "../assets/bear-error.png"; 

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-page-container-erorr">
      <img
       src="/images/bear-empty.png"
        alt="Сумний ведмедик"
        style={{
          width: "295px",
          height: "355px",
          marginBottom: "20px",      
          animation: "float 3s ease-in-out infinite",
        }}
      />
      <h1 className="title-light-full-page">404</h1>
      <p className="error-text-404">Ой! Сторінка загубилася у лісі...</p>
      <p className="description-light">
      Але ведмедик уже в дорозі 🐻, щоб допомогти знайти правильну стежку. <br/>Повернімося на головну, там безпечніше! 
      </p>
      <button className="error-btn-404" onClick={() => navigate("/")}>
        НА ГОЛОВНУ
      </button>
    </div>
  );
};

export default NotFoundPage;
