// components/ParentSurvey/SurveyStep9.jsx 
import React from "react";
import animals from "../../assets/bear-error.png"; 

const SurveyStep9 = ({ onNext, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <img className="animals-img" src={animals} alt="Веселі тваринки" />

      <h1 className="title-dark-survey">Цікаво,</h1>
      <p className="description-dark">
      що діти, які спілкуються іноземною мовою з раннього віку, <br/> 
      засвоюють її природно, як рідну, без потреби у додатковому <br/> 
      навчанні!
      </p>

      <div className="step-next-button">
        <button className="next-btn" onClick={onNext}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep9;