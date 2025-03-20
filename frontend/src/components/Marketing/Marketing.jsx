import React from "react";
import "./style.css";

export const Marketing = ({ className }) => {
  return (
    <div className={`marketing ${className}`}>
      <p className="text-wrapper-13">Отримайте знижку 20% на першу послугу!</p>

      <img
        className="waves"
        alt="Waves"
        src="/assets/waves.svg"
      />

      <img
        className="waves-2"
        alt="Waves"
        src="/assets/waves-2.svg"
      />
    </div>
  );
};