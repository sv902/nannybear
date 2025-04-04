// components/ParentSurvey/SurveyStep4.jsx 
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const workOptions = [
  { label: "⌛ Погодинно", value: "Погодинно" },
  { label: "🌗 Неповний день (4-8 годин)", value: "Неповний день" },
  { label: "⏰ Повний день (8+ годин)", value: "Повний день" },
  { label: "🌙 Нічні зміни", value: "Нічні зміни" },
  { label: "📆 Гнучкий графік (залежить від потреб)", value: "Гнучкий графік" },
  { label: "❓ Ще не вирішили", value: "Ще не вирішили" },
];

const SurveyStep4 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (value) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleNextClick = () => {
    if (selected.length === 0) {
      alert("Будь ласка, оберіть хоча б один варіант.");
      return;
    }

    onSelect && onSelect(selected);
    onNext();
  };

  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <div className="survey-container">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <p className="question-dark-survey">Який графік вас цікавить?</p>
        <p className="text-dark">Можна обрати декілька варіантів</p>

        <div className="checkbox-group">
          {workOptions.map((option, index) => (
            <label key={index} className="checkbox-option">
              <span>{option.label}</span>
              <input
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => handleSelect(option.value)}
              />
            </label>
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

export default SurveyStep4;
