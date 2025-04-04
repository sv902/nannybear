// components/ParentSurvey/SurveyStep7.jsx 
import React from "react";
import animals from "../../assets/bear-error.png"; 

const SurveyStep7 = ({ onNext, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <img className="animals-img" src={animals} alt="Веселі тваринки" />

      <h1 className="title-dark-survey">Освіта важлива,</h1>
      <p className="description-dark">
      але ще важливіші тепло, турбота та вміння знайти підхід до <br/> дитини. 
      </p>

      <div className="step-next-button">
        <button className="next-btn" onClick={onNext}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep7;