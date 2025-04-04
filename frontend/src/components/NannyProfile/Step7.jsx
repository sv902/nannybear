// components/NannyProfile/Step7.jsx

import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step7 = ({ onNext, onBack, onSelect }) => {

  const MAX_LANGUAGES = 5;

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customLanguages, setCustomLanguages] = useState([]);

  const languages = [
    { code: "uk", name: "Українська", flag: "https://flagcdn.com/w40/ua.png" },
    { code: "gb", name: "Англійська", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "de", name: "Німецька", flag: "https://flagcdn.com/w40/de.png" },
    { code: "fr", name: "Французька", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "pl", name: "Польська", flag: "https://flagcdn.com/w40/pl.png" },
    { code: "es", name: "Іспанська", flag: "https://flagcdn.com/w40/es.png" },
  ];

  const toggleLanguage = (lang) => {
    setSelectedOptions((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };
 

  const handleNextClick = () => {
    const allLanguages = [...selectedOptions, ...customLanguages.filter(Boolean)];
  
    if (allLanguages.length === 0) {
      alert("Будь ласка, оберіть мови якими володієте.");
      return;
    }
    if (allLanguages.length > MAX_LANGUAGES) {
      alert(`Максимум ${MAX_LANGUAGES} мов.`);
      return;
    }
  
    onSelect(allLanguages); // передаємо ВСІ мови
    onNext();
  };  

  return (
    <div className="specialization-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Вкажіть володіння мов</h1>
      <p className="description-light">
        Можна обрати декілька варіантів. Ці дані допоможуть батькам <br />
        знаходити Вас.
      </p>

      <div className="specialization-selection">
        <div className="specialization-label-row">
          <p className="left-text">Ваші мови спілкування...</p>
          <p className="right-text">обов’язкове поле</p>
        </div>

        <div className="options-row-lang">
          {languages.map(({ name, flag }) => (
            <button
              key={name}
              type="button"
              className={`option-pill ${selectedOptions.includes(name) ? "selected" : ""}`}
              onClick={() => toggleLanguage(name)}
            >
              <img src={flag} alt={name} style={{ width: "24px", marginRight: "8px" }} />
              {name}
            </button>
          ))}
        </div>

        {selectedOptions.filter((lang) => !languages.find((l) => l.name === lang)).length > 0 && (
          <div className="options-row">
            {selectedOptions
              .filter((lang) => !languages.find((l) => l.name === lang))
              .map((lang, index) => (
                <div key={index} >
                  <button
                    type="button"
                    className="option-pill selected"
                    style={{ position: "relative", paddingRight: "40px" }}
                  >
                    {lang}
                    <span
                      onClick={() =>
                        setSelectedOptions((prev) => prev.filter((l) => l !== lang))
                      }
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "12px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >                     
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 20 20">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#FFFAEE" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </div>
              ))}
          </div>
        )}

        <div className="add-education-block">
          <p className="lang-description">
            Немає мови, якою Ви володієте? Додайте нижче.
          </p>

          {customLanguages.map((lang, index) => (
            <div key={index} className="lang-form-wrapper">
            <input
              type="text"
              className="lang-input-with-btn"
              placeholder="Ваша мова спілкування..."
              value={lang}
              onChange={(e) => {
                const updated = [...customLanguages];
                updated[index] = e.target.value;
                setCustomLanguages(updated);
              }}
            />
            <button
              type="button"
              className="remove-lang-btn-inside"
              onClick={() => {
                const updated = [...customLanguages];
                updated.splice(index, 1);
                setCustomLanguages(updated);
              }}
            >
              ✖
            </button>
          </div>
          ))}

          {customLanguages.length + selectedOptions.length < MAX_LANGUAGES && (
            <button
              type="button"
              className="option-pill"
              onClick={() => setCustomLanguages([...customLanguages, ""])}
            >
              Додати мову спілкування
            </button>
          )}
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

export default Step7;
