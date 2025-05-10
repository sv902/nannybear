// src/components/BodyHyperlink/BodyHyperlink.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const BodyHyperlink = ({ className = "", text = "Дисклеймер", to = "", external = false }) => {
  return external ? (
    <a href={to} className={`body-hyperlink ${className}`} target="_blank" rel="noopener noreferrer">
      <div className="text-wrapper-7">{text}</div>
    </a>
  ) : (
    <Link to={to} className={`body-hyperlink ${className}`}>
      <div className="text-wrapper-7">{text}</div>
    </Link>
  );
};
