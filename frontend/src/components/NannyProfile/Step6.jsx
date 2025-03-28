import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step6 = ({ onNext, onBack, onSelect }) => {
  const [noEducation, setNoEducation] = useState(false);
  const [educations, setEducations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: "", specialty: "", years: "" });

  const handleToggleNoEducation = () => {
    setNoEducation((prev) => !prev);
    if (!noEducation) {
      setEducations([]);
      setShowForm(false);
    }
  };

  const handleChange = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  const handleAddEducation = () => {
    if (!newEdu.institution || !newEdu.specialty || !newEdu.years) {
      alert("Будь ласка, заповніть усі поля.");
      return;
    }

    setEducations((prev) => [...prev, newEdu]);
    setNewEdu({ institution: "", specialty: "", years: "" });
    setShowForm(false);
  };

  const handleDeleteEducation = (index) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextClick = () => {
    if (!noEducation && educations.length === 0) {
      alert("Будь ласка, додайте хоча б одну освіту або виберіть варіант без освіти.");
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

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваша освіта...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        <div className="options-row">
          <button
            type="button"
            className={`option-pill ${noEducation ? "selected" : ""}`}
            onClick={handleToggleNoEducation}
          >
            Немає профільної освіти
          </button>
        </div>

        {!noEducation && (
          <>
            {educations.map((edu, index) => (
              <div key={index} className="education-entry">
                <p><strong>ЗВО:</strong> {edu.institution} | <strong>Спеціальність:</strong> {edu.specialty} | <strong>Роки:</strong> {edu.years}</p>
                <button className="remove-education-btn" onClick={() => handleDeleteEducation(index)}>Видалити</button>
              </div>
            ))}

            {!showForm ? (
              <div className="add-education-block">
                <button
                  type="button"
                  className="option-pill"
                  onClick={() => setShowForm(true)}
                >
                  Додати освіту
                </button>
                <p className="option-description">Не забувайте про курси <br /> підвищення кваліфікації 😉</p>
              </div>
            ) : (
              <div className="education-form">
                <input
                  type="text"
                  name="institution"
                  placeholder="Назва ЗВО"
                  value={newEdu.institution}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="specialty"
                  placeholder="Спеціальність"
                  value={newEdu.specialty}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="years"
                  placeholder="Роки навчання (рік–рік)"
                  value={newEdu.years}
                  onChange={handleChange}
                />
                <button type="button" className="option-pill" onClick={handleAddEducation}>
                  Зберегти освіту
                </button>
              </div>
            )}
          </>
        )}
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
