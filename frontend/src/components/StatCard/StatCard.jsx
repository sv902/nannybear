import React from "react";
import "./style.css";

export const StatCard = ({
  className,
  text = "ДОВІРЯЮТЬ",
  text1 = "60 211",
  text2 = "БАТЬКІВ",
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="group">
        <div className="text-wrapper">{text}</div>

        <div className="element">{text1}</div>
      </div>

      <div className="div">{text2}</div>
    </div>
  );
};