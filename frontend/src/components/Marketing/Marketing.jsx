import React from "react";
import "./style.css";

export const Marketing = ({ className }) => {
  return (
    <div className={`marketing ${className}`}>
      <p className="text-wrapper-13">Отримайте знижку 20% на першу послугу!</p>

      <img
        className="waves"
        alt="Waves"
        src="https://c.animaapp.com/2TWqjeZc/img/waves-2.svg"
      />

      <img
        className="waves-2"
        alt="Waves"
        src="https://c.animaapp.com/2TWqjeZc/img/waves-3.svg"
      />
    </div>
  );
};