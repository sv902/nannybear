// components/BearPlaceholder.jsx
import React from "react";

const BearPlaceholder = ({ text = "тут ще нічого немає ☹️" }) => (
  <div className="empty-message">
    <img src="/images/bear-empty.png" alt="Пусто" className="bear-image" />
    <p className="empty-text">{text}</p>
  </div>
);

export default BearPlaceholder;
