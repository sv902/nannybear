// components/NannyProfile/Step3.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";
import Male from "../../assets/male.png";
import Female from "../../assets/female.png";

const Step3 = ({ onNext, onBack, onSelect }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    onSelect(gender);
  };

  const handleNextClick = () => {
    if (!selectedGender) {
      alert("Будь ласка, оберіть стать.");
      return;
    }
    onNext();
  };

  return (
    <div className="email-confirmation-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Оберіть стать</h1>
      <p className="description-light">
        Можна обрати один варіант. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>

      <div className="gender-selection">
        <div className="gender-label-row">
          <p className="name-input-p">ВАША СТАТЬ:</p>
          <p className="required-field">обов’язкове поле</p>
        </div>

        <div className="gender-btn">
          <div
            className={`gender-option ${selectedGender === "female" ? "selected" : ""}`}
            onClick={() => handleSelect("female")}
          >
            <img src={Female} alt="Жінка" />
            <p>Жіночий</p>
          </div>

          <div
            className={`gender-option ${selectedGender === "male" ? "selected" : ""}`}
            onClick={() => handleSelect("male")}
          >
            <img src={Male} alt="Чоловік" />
            <p>Чоловічий</p>
          </div>
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

export default Step3;



