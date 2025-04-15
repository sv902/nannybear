// components/ParentSurvey/SurveyStep6.jsx 
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const educationOptions = [
  { label: "🎓 Психологічна освіта", value: "Психологічна освіта" },
  { label: "🏫 Педагогічна освіта", value: "Педагогічна освіта" },
  { label: "🏥 Медична освіта", value: "Медична освіта" },
  { label: "✔️ Не важлива", value: "Не важлива" },  
];

const SurveyStep6 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleNextClick = () => {
    if (selectedOptions.length === 0) {
      alert("Будь ласка, оберіть хоча б один варіант.");
      return;
    }

    onSelect && onSelect(selectedOptions);
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

        <p className="question-dark-survey">Яка освіта няні для вас важлива? </p>
        <p className="text-dark">Можна обрати декілька варіантів</p>

        <div className="checkbox-group">
          {educationOptions.map((option, index) => (
            <label key={index} className="checkbox-option">
              <span>{option.label}</span>
              <input
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
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

export default SurveyStep6;
