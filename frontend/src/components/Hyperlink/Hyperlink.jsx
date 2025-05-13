import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const Hyperlink = ({ className = "", text = "ПРО НАС", to, onClick }) => {
  const isAnchorLink = to && to.startsWith("#");

  const handleAnchorClick = (e, target) => {
    e.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `/#${target}`);
    }
  };

  if (isAnchorLink) {
    const targetId = to.slice(1);
    return (
      <a
        href={to}
        className={`hyperlink ${className}`}
        onClick={(e) => handleAnchorClick(e, targetId)}
      >
        {text}
      </a>
    );
  }

  return (
    <Link to={to} className={`hyperlink ${className}`} onClick={onClick}>
      {text}
    </Link>
  );
};
