import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const SecondaryButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`secondary-button ${className}`}
      onClick={() => navigate("/registrationlogin?section=register")} // Перехід на сторінку реєстрації
    >
      <div className="text-wrapper-12">РЕЄСТРАЦІЯ</div>
    </div>
  );
};