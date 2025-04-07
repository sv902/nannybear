// components/ParentSurvey/SurveyStep12.jsx 
import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";
import "../../styles/survey.css";
import "../../styles/profileStep.css";

const SurveyStep12 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [experience, setExperience] = useState(0);
  const [bearPosition, setBearPosition] = useState(0);
  const sliderRef = useRef(null);

  const sliderMin = 0;
  const sliderMax = 5;
  
  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const bearWidth = 122;
      const percent = (experience - sliderMin) / (sliderMax - sliderMin);
      const position = percent * (sliderWidth - bearWidth);
      setBearPosition(position);
      document.documentElement.style.setProperty('--progress', experience / sliderMax);
    }
  }, [experience]);

  const getLabel = (value) => {
    if (value === 0) return "<1 року";
    if (value === 1) return "1 рік";
    if (value === 5) return "5+ років";
    return `${value} роки`;
  };  

  const handleNextClick = () => {
    if (experience === null) {
      alert("Будь ласка, оберіть свій досвід роботи.");
      return;
    }
    onSelect && onSelect(Number(experience));
    onNext();
  };

  return (
    <div >
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <div className="money-container"> 
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <p className="question-dark-survey">Чи має бути у няні досвід роботи? </p>
        <p className="text-dark">Будь ласка, вкажіть значення на повзунку</p>

        <div className="specialization-selection">
       
        <div className="slider-container" ref={sliderRef}>   
          <div
            className="bear-head-survey"
            style={{                      
              left: `${bearPosition}px`,             
            }}
          >
           <span className="bear-value">{getLabel(experience)}</span>
          </div>
          <div className="slider-labels-top-survey">
            <span>&lt;1</span>
            <span>5+</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={experience}
            onChange={(e) => setExperience(parseInt(e.target.value))}
            className="experience-slider"
          />          
        </div>
      </div>

      </div>
      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep12;