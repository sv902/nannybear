import React from "react";

export const RoundAnimate = ({ className }) => {
  return (
    <svg
      className={`round-animate ${className}`}
      fill="none"
      height="271"
      viewBox="0 0 271 271"  
      width="271"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href="/assets/roundanimate.png"
        width="271"
        height="271"
        preserveAspectRatio="xMidYMid meet"  
      />
    </svg>
  );
};