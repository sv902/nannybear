// components/ParentSurvey/SurveyStep8.jsx 
import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const languagesOptions = [
  { label: "Українська", img: "https://flagcdn.com/w40/ua.png" },
  { label: "Англійська", img: "https://flagcdn.com/w40/gb.png" },
  { label: "Німецька", img: "https://flagcdn.com/w40/de.png" },
  { label: "Польська", img: "https://flagcdn.com/w40/pl.png" },
  { label: "Французька", img: "https://flagcdn.com/w40/fr.png" },
  { label: "Іспанська", img: "https://flagcdn.com/w40/es.png" },
  { label: "Інша", img: null, icon: "➕" },
];

const SurveyStep8 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
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

        <p className="question-dark-survey">Які мови має знати няня?</p>
        <p className="text-dark">Можна обрати декілька варіантів</p>

        <div className="checkbox-group">
          {languagesOptions.map(({ label, img, icon }) => (
            <label key={label} className="checkbox-option">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {img ? (
                  <img
                    src={img}
                    alt={label}
                    style={{ width: "24px", height: "16px", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "20px" }}>{icon || "🌐"}</span>
                )}
                <span>{label}</span>
              </div>

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

export default SurveyStep8;
