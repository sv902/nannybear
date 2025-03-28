// components/NannyProfile/Step8.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step8 = ({ onNext, onBack, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNextClick = () => {
    if (selectedOptions.length === 0) {
      alert("Будь ласка, оберіть хоча б одину навичку.");
      return;
    }
    onSelect(selectedOptions); 
    onNext();
  };

  const renderOptions = (label, options) => (
    <>
      <p className="description-label">{label}</p>
      <div className="options-row">
        {options.map((option) => (
          <button
            key={option}
            className={`option-pill ${selectedOptions.includes(option) ? "selected" : ""}`}
            onClick={() => toggleOption(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="specialization-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">оберіть додаткові навички</h1>
      <p className="description-light">
      Можна обрати декілька варіантів. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваші додаткові навички...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        {renderOptions("", [
          "Допомога зі школою",
          "Розвиток дітей",
          "Кулінарія",
          "водіння машини",
          "прибирання",
          "розвиток творчості",
          "фізичний розвиток",
          "Догляд за хворою дитиною",
        ])}
              
      </div>

      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  );
};

export default Step8;



