import React from "react";
import "./style.css";

export const FormButton = ({ className }) => {
  return (
    <div className={`form-button ${className}`}>
      <div className="overlap-group-2">
        <div className="text-wrapper-6">Ваш email....</div>

        <div className="rectangle-4" />

        <img
          className="img"
          alt="Arrow"
          src="https://c.animaapp.com/2TWqjeZc/img/arrow-3-2.svg"
        />
      </div>
    </div>
  );
};