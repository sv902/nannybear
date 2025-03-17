import React from "react";
import "./style.css";

export const SecondaryButton = ({ className }) => {
  return (
    <div className={`secondary-button ${className}`}>
      <div className="text-wrapper-12">РЕЄСТРАЦІЯ</div>
    </div>
  );
};