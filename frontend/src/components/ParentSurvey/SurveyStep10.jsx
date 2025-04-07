// components/ParentSurvey/SurveyStep10.jsx 
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const extraServices = [
  { emoji: "📚", label: "Допомога з домашніми завданнями" },
  { emoji: "🍲", label: "Приготування їжі для дитини" },
  { emoji: "🚗", label: "Можливість забирати дитину з садка/школи" },
  { emoji: "🏠", label: "Легка хатня робота (прання дитячих речей, прибирання дитячої кімнати)" },
  { emoji: "🎨", label: "Творчі заняття (малювання, ліплення, музика)" },
  { emoji: "🏃‍♂️", label: "Фізична активність (прогулянки, ігри, спорт)" },
  { emoji: "🌍", label: "Викладання іноземної мови" },
  { emoji: "🏥", label: "Догляд за хворою дитиною" },
];

const SurveyStep10 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (label) => {
    setSelectedOptions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNextClick = () => {
    if (selectedOptions.length === 0) {
      alert("Будь ласка, оберіть хоча б одну послугу.");
      return;
    }

    onSelect && onSelect(selectedOptions); // передаємо БЕЗ емодзі
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

        <p className="question-dark-survey">Які додаткові навички чи обов’язки важливі?</p>
        <p className="text-dark">Можна обрати декілька варіантів</p>

        <div className="checkbox-group">
          {extraServices.map(({ emoji, label }, index) => (
            <label key={index} className="checkbox-option">
              <span>{emoji} {label}</span>
              <input
                type="checkbox"
                value={label}
                checked={selectedOptions.includes(label)}
                onChange={() => handleCheckboxChange(label)}
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

export default SurveyStep10;
