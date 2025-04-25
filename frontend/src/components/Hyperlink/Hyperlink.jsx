import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const Hyperlink = ({ className, divClassName, text = "ПРО НАС", to, onClick }) => {
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
    const targetId = to.slice(1); // Remove the "#" from the link

    return (
      <a
        href={to}
        className={`hyperlink ${className}`}
        onClick={(e) => handleAnchorClick(e, targetId)} // Handle the smooth scroll
      >
        <div className={`text-wrapper-10 ${divClassName}`}>{text}</div>
      </a>
    );
  }

  return (
    <Link to={to} className={`hyperlink ${className}`} onClick={onClick}>
      <div className={`text-wrapper-10 ${divClassName}`}>{text}</div>
    </Link>
  );
};