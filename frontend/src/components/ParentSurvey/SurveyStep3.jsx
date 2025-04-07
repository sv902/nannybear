import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const nannyOptions = [
  { label: "👶 Няня для немовляти (0-1 рік)", value: "Няня для немовляти" },
  { label: "🏡 Няня для дошкільнят (для дітей 1-6 років)", value: "Няня для доШкільнят" },
  { label: "🏫 Няня для школярів (допомога з навчанням, супровід)", value: "Няня для школярів" },
  { label: "🎓 Гувернантка (няня з педагогічним підходом)", value: "Няня-Гувернантка" },
  { label: "⏳ Няня погодинно", value: "Няня погодинно" },
  { label: "🌙 Нічна няня", value: "Нічна няня" },
  { label: "🏠 Няня з проживанням", value: "Няня з проживанням" },
  { label: "🏕 Няня супровід за кордон", value: "Няня Супровід за кордон" },
  { label: "🤝 Няня для дитини з особливими потребами", value: "Няня для дитини з особливими потребами" },
  { label: "🍲 Няня-домогосподарка", value: "Няня-домогосподарка" },
  { label: "📅 Няня постійної основи", value: "Няня постійної основи" },
];


const SurveyStep3 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
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

      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <p className="question-dark-survey">Який тип няні вам потрібен?</p>
      <p className="text-dark">Можна обрати декілька варіантів</p>

      <div className="checkbox-group">
        {nannyOptions.map((option, index) => (
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

      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default SurveyStep3;
