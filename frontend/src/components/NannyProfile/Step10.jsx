// components/NannyProfile/Step10.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step10 = ({ onNext, onBack, onSelect }) => {
  const [experience, setExperience] = useState(0);
  const [bearPosition, setBearPosition] = useState(0);
  const sliderRef = useRef(null);
  
  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const bearWidth = 122; // ширина .bear-head
      const stepCount = 500;
      const position = (experience / stepCount) * (sliderWidth - bearWidth);
      setBearPosition(position);
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
    <div className="email-confirmation-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Вкажіть Оплату за годину</h1>
      <p className="description-light">
        Оберіть кількість років, протягом яких Ви працювали нянею.<br />
        Ці дані допоможуть батькам знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваша оплата за годину...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        <div className="slider-container" ref={sliderRef}>   
          <div
            className="bear-head"
            style={{                      
              left: `${bearPosition}px`,             
            }}
          >
            <span className="bear-value">
              {experience === 500 ? "500" : `${experience}`} ГРН
            </span>
          </div>
          <div className="slider-labels-top-money">
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

      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default Step10;
