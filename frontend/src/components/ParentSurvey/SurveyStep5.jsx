// components/ParentSurvey/SurveyStep5.jsx 
import React from "react";
import animals from "../../assets/bear-error.png"; 

const SurveyStep5 = ({ onNext, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <img className="animals-img" src={animals} alt="Веселі тваринки" />

      <h1 className="title-dark-survey">Кожна дитина унікальна</h1>
      <p className="description-dark">
        Ми допоможемо знайти няню, яка підходить саме Вам.
      </p>

      <div className="step-next-button">
        <button className="next-btn" onClick={onNext}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep5;
