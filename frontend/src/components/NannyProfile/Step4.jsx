// components/NannyProfile/Step4.jsx

import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step4 = ({ onNext, onBack, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNextClick = () => {
    if (selectedOptions.length === 0) {
      alert("Будь ласка, оберіть хоча б одну спеціалізацію.");
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

      <h1 className="title-light-full-page">Оберіть спеціалізацію</h1>
      <p className="description-light">
      Можна обрати декілька варіантів. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">ВАША СПЕЦІАЛІЗАЦІЯ...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        {renderOptions("За віком дитини:", [
          "Няня для немовляти",
          "Няня для доШкільнят",
          "Няня для Шкколярів",          
        ])}

        {renderOptions("За способом роботи:", [
          "Няня погодинно",
          "Няня постійної основи",
          "Няня з проживанням",
          "Нічна няня",
        ])}

        {renderOptions("Додаткові послуги:", [
          "Няня для діток з особливими потребами",
          "Няня Супровід за кордон",
          "Няня-Гувернантка",
          "Няня-домогосподарка",
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

export default Step4;




