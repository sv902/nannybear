import React from "react";
import "./style.css";

export const Hyperlink = ({ className, divClassName, text = "ПРО НАС" }) => {
  return (
    <div className={`hyperlink ${className}`}>
      <div className={`text-wrapper-10 ${divClassName}`}>{text}</div>
    </div>
  );
};