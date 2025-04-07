// components/ParentSurvey/SurveyStep11.jsx 
import React from "react";
import animals from "../../assets/bear-error.png"; 

const SurveyStep11 = ({ onNext, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <div className="description-container">
      <img className="animals-img" src={animals} alt="Веселі тваринки" />

      <h1 className="title-dark-survey">діти, які отримують підтримку </h1>
      <p className="description-dark">
      у навчанні вдома, частіше зберігають цікавість до знань у <br/> майбутньому
      </p>
      </div>
      <div className="step-next-button">
        <button className="next-btn" onClick={onNext}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep11;