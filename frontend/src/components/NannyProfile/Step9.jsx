// components/NannyProfile/Step9.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step9 = ({ onNext, onBack, onSelect }) => {
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
    onSelect && onSelect(experience === 0 ? 0.5 : experience);
    onNext();
  };

  return (
    <div className="email-confirmation-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Вкажіть досвід роботи</h1>
      <p className="description-light">
        Оберіть кількість років, протягом яких Ви працювали нянею.<br />
        Ці дані допоможуть батькам знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваш досвід роботи...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        <div className="slider-container" ref={sliderRef}>   
          <div
            className="bear-head"
            style={{                      
              left: `${bearPosition}px`,             
            }}
          >
            <span className="bear-value">{getLabel(experience)}</span>
          </div>
          <div className="slider-labels-top">
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

      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default Step9;
