// components/ParentSurvey/SurveyStep13.jsx 
import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";
import "../../styles/survey.css";

const SurveyStep13 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [experience, setExperience] = useState(0);
  const [bearPosition, setBearPosition] = useState(0);
  const sliderRef = useRef(null);
  
  const sliderMin = 0;
  const sliderMax = 500;
    
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
  

  const handleNextClick = () => {
    if (!experience || experience < 10) {
      alert("Будь ласка, оберіть оплату за годину (мінімум 10 грн).");
      return;
    }
    onSelect(experience);
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

        <p className="question-dark-survey">Який рівень оплати вас влаштовує? </p>
        <p className="text-dark">Будь ласка, вкажіть значення на повзунку</p>

      <div className="specialization-selection">
        
        <div className="slider-container" ref={sliderRef}>   
          <div
            className="bear-head-survey"
            style={{                      
              left: `${bearPosition}px`,             
            }}
          >
            <span className="bear-value">
              {experience === 500 ? "500" : `${experience}`} ГРН
            </span>
          </div>
          <div className="slider-labels-top-money-survey">
            <span>0</span>
            <span>500</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
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

export default SurveyStep13;