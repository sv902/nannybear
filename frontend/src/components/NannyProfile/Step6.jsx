// components/NannyProfile/Step6.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";
import cameraIcon from "../../assets/camera.svg";

const Step6 = ({ onNext, onBack, onSelect }) => {
  const [noEducation, setNoEducation] = useState(false);
  const [educations, setEducations] = useState([]);
  const MAX_EDUCATIONS = 5;

  const handleToggleNoEducation = () => {
    setNoEducation((prev) => !prev);
    setEducations([]);
  };

  const handleInputChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...educations];
    updated[index][name] = files ? files[0] : value;
    setEducations(updated);
  };

  const addEducation = () => {
    if (educations.length >= MAX_EDUCATIONS) {
      alert(`Максимум ${MAX_EDUCATIONS} записів освіти.`);
      return;
    }

    setNoEducation(false); // якщо користувач вирішив додати — знімаємо "немає освіти"

    setEducations((prev) => [
      ...prev,
      {
        institution: "",
        specialty: "",
        startYear: "",
        endYear: "",
        diploma_image: null,
      },
    ]);
  };

  const deleteEducation = (index) => {
    const updated = [...educations];
    updated.splice(index, 1);
    setEducations(updated);
  };

  const handleNextClick = () => {
    if (!noEducation && educations.some(e => !e.institution || !e.specialty || !e.startYear || !e.endYear)) {
      alert("Будь ласка, заповніть усі поля або виберіть 'немає освіти'.");
      return;
    }

    const result = noEducation ? ["Немає профільної освіти"] : educations;
    onSelect(result);
    onNext();
  };

  return (
    <div className="specialization-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Вкажіть вашу освіту</h1>
      <p className="description-light">
        Можна додати кілька варіантів. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>
      <div className="specialization-label-row">
          <p className="left-text">Ваша освіта...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>
        
      <div className="specialization-selection">
        

        <div className="options-col">
          <button
            type="button"
            className={`option-pill ${noEducation ? "selected" : ""}`}
            onClick={handleToggleNoEducation}
          >
            Немає профільної освіти
          </button>          

        {!noEducation && educations.map((edu, index) => (
          <div key={index} className="education-block">
            <div className="education-header">
              <strong>Освіта {index + 1}</strong>
              <button
                className="remove-education-btn"
                onClick={() => deleteEducation(index)}
              >
                ✖
              </button>
            </div>

            <input
              className="education-input"
              type="text"
              name="institution"
              placeholder="Назва навчального закладу..."
              value={edu.institution}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              className="education-input"
              type="text"
              name="specialty"
              placeholder="Направлення..."
              value={edu.specialty}
              onChange={(e) => handleInputChange(index, e)}
            />
            <div className="years-row">
              <input
                className="education-input"
                type="text"
                name="startYear"
                placeholder="Рік початку"
                value={edu.startYear}
                onChange={(e) => handleInputChange(index, e)}
              />
              <input
                className="education-input"
                type="text"
                name="endYear"
                placeholder="Рік закінчення"
                value={edu.endYear}
                onChange={(e) => handleInputChange(index, e)}
              />
            </div>
            <label className="custom-file-upload">
              <input
                type="file"
                name="diploma_image"
                accept="image/*"
                onChange={(e) => handleInputChange(index, e)}
              />
              <img src={cameraIcon} alt="Іконка камери" className="camera-icon" />Додати фото диплому
            </label>
            {edu.diploma_image && (
              <p className="file-added-text">
                📎 Файл додано: <strong>{typeof edu.diploma_image === "string" ? edu.diploma_image : edu.diploma_image.name}</strong>
              </p>
            )}
          </div>
        ))}
        {educations.length < MAX_EDUCATIONS && (
                    <button 
                      type="button"
                      className="option-pill add-education-btn"
                      onClick={addEducation}
                    >
                      Додати освіту
                    </button>
                  )}
                  <p className="option-description">
                    Не забувайте про курси <br /> підвищення кваліфікації 😉
                  </p>
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

export default Step6;
