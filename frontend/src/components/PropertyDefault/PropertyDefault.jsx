import React from "react";
import "./style.css";

export const PropertyDefault = ({ className }) => {
  return (
    <div className={`property-default ${className}`}>
      <img
        className="union"
        alt="Union"
        src="https://c.animaapp.com/2TWqjeZc/img/union-3.svg"
      />

      <div className="text-wrapper-5">ЗНАЙТИ НЯНЮ</div>

      <img
        className="arrow"
        alt="Arrow"
        src="https://c.animaapp.com/2TWqjeZc/img/arrow-2-3.svg"
      />
    </div>
  );
};