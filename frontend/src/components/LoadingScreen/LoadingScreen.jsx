// src/components/LoadingScreen.jsx
import React from "react";
import "../../styles/loading.css";

const LoadingScreen = ({ text = "Завантаження..." }) => {
  return (
    <div className="loading-screen">
      <div className="image-wrapper">
        <img
          src="/assets/AnimalsReviews.svg"
          alt="Фон"
          className="background-image"
        />
        <div className="overlay-content">
          <div className="spinner" />
          <p className="loading-text">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;





