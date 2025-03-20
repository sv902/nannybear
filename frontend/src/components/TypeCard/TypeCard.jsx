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
        src="/assets/ScreenshotTypeCard.png"
      />
    </div>
  );
};