// components/NannyProfile/Step5.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step5 = ({ onNext, onBack, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const options = [
    { label: "Погодинно", description: "1–3 години" },
    { label: "Неповний день", description: "4–7 годин" },
    { label: "Повний день", description: "8+ годин" },
    { label: "Нічні зміни", description: "нічна няня" },
  ];

  const toggleOption = (label) => {
    setSelectedOptions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNextClick = () => {
    if (selectedOptions.length === 0) {
      alert("Будь ласка, оберіть Ваш графік роботи.");
      return;
    }
    onSelect(selectedOptions); 
    onNext();
  };
  
  return (
    <div className="specialization-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Оберіть графік роботи</h1>
      <p className="description-light">
      Можна обрати декілька варіантів. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваш графік роботи...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        <div className="options-row">
          {options.map(({ label, description }) => (
            <div key={label} className="option-with-description">
              <button
                type="button"
                className={`option-pill ${selectedOptions.includes(label) ? "selected" : ""}`}
                onClick={() => toggleOption(label)}
              >
                {label}
              </button>
              <p className="option-description">{description}</p>
            </div>
          ))}       
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

export default Step5;





