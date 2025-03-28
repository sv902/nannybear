import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const PrimaryButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`primary-button ${className}`}
      onClick={() => navigate("/registrationlogin?section=login")} // Перехід на сторінку входу
    >
      <div className="text-wrapper-11">ВХІД</div>
    </div>
  );
};