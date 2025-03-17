import React from "react";

export const Property1Default = ({ color = "#FFFAEE", className }) => {
  return (
    <svg
      className={`property-1-default ${className}`}
      fill="none"
      height="32"
      viewBox="0 0 32 32"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M23 8.2H19.2419C18.5631 8.2 18.0125 8.80211 18.0125 9.54584V14.2669H23L22.2694 19.4648H18.0131V29H12.5281V19.4648H8V14.2669H12.4694L12.5281 9.33374L12.52 8.43742C12.5136 7.72604 12.6361 7.02033 12.8803 6.36106C13.1246 5.7018 13.4857 5.10205 13.9429 4.59646C14.4001 4.09088 14.9442 3.68948 15.5439 3.41546C16.1437 3.14144 16.787 3.00024 17.4369 3H23V8.2Z"
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  );
};