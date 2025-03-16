import React from "react";
import "./style.css";

export const PrimaryButton = ({ className }) => {
  return (
    <div className={`primary-button ${className}`}>
      <div className="text-wrapper-11">ВХІД</div>
    </div>
  );
};