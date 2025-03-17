import React from "react";
import "./style.css";

export const BodyHyperlink = ({ className, text = "Дисклеймер" }) => {
  return (
    <div className={`body-hyperlink ${className}`}>
      <div className="text-wrapper-7">{text}</div>
    </div>
  );
};