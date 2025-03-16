import React from "react";
import "./style.css";

export const TypeCard = ({
  className,
  text = "НЯНЯ НА ПОСТІЙНУ ОСНОВУ",
  text1 = "Щоденний догляд, розвиток, супровід дитини у комфортній атмосфері.",
}) => {
  return (
    <div className={`type-card ${className}`}>
      <div className="text-wrapper-8">{text}</div>

      <p className="text-wrapper-9">{text1}</p>

      <img
        className="screenshot"
        alt="Screenshot"
        src="https://c.animaapp.com/2TWqjeZc/img/screenshot-2025-02-25-at-14-29-51-4-6@2x.png"
      />
    </div>
  );
};