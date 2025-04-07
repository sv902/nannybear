import React, { useState } from "react";
import Male from "../../assets/male.png";
import Female from "../../assets/female.png";
import ProgressBar from "./ProgressBar";

const SurveyStep2 = ({ onNext, onBack, onSelect, currentStep, totalSteps }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    onSelect(gender);
  };

  const handleNextClick = () => {
    if (!selectedGender) {
      alert("Будь ласка, зробіть свій вибір.");
      return;
    }
    onNext();
  };

  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>
      
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <p className="question-dark-survey">
        Чи має значення стать няні?
      </p>

      <div className="gender-selection-survey">      

        <div className="gender-btn-survey">
          <div
            className={`gender-option-survey ${selectedGender === "female" ? "selected" : ""}`}
            onClick={() => handleSelect("female")}
          >
            <img src={Female} alt="Жінка" />
            <p>Жіноча</p>
          </div>

          <div
            className={`gender-option-survey ${selectedGender === "male" ? "selected" : ""}`}
            onClick={() => handleSelect("male")}
          >
            <img src={Male} alt="Чоловік" />
            <p>Чоловіча</p>
          </div>

          <label className="radio-only">
            Немає значення
            <input
              type="radio"
              name="gender"
              value="any"
              checked={selectedGender === "any"}
              onChange={() => handleSelect("any")}
            />
          </label>


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

export default SurveyStep2;
