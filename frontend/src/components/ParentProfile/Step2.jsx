// components/ParentProfile/Step2.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step2 = ({ formData, setFormData, onNext, onBack }) => { 
  const children = formData.children || [];
  const [isOpen, setIsOpen] = useState(false);

  const addChild = () => {
    if (children.length >= 14) {
      alert("Максимальна кількість дітей — 14");
      return;
    }
  
  setFormData(prev => ({
    ...prev,
    children: [...children, { name: "", day: "", month: "", year: "" }],
  }));
};

const handleChildChange = (index, field, value) => {
  const updatedChildren = [...children];
  updatedChildren[index][field] = value;

  setFormData(prev => ({
    ...prev,
    children: updatedChildren,
  }));
};

const removeChild = (index) => {
  const updatedChildren = children.filter((_, i) => i !== index);
  setFormData(prev => ({
    ...prev,
    children: updatedChildren,
  }));
};



  const handleNextClick = () => {
    // Діти не обов’язкові — тільки якщо їх додали, перевіряємо валідацію
    const hasInvalid = children.some(child =>
      !child.name || !child.day || !child.month || !child.year
    );    

    if (hasInvalid) {
      alert("Будь ласка, заповніть усі поля кожної дитини або видаліть порожні.");
      return;
    }

    onNext();
  };
  

  return ( 
    <div className="reg-form-container">
    <button onClick={onBack} className="back-button">
      <span className="back-text">НАЗАД</span>
      <span className="back-arrow"></span>
    </button>

    <h1 className="title-light-full-page">Ваші діти</h1>
    <p className="description-light">Будь ласка, вкажіть дані маленьких клієнтів!</p>
   
    <div className="your-kids-wrapper">
      <p className="your-kids-p">ВАШІ ДІТИ</p>
    </div>   
    
   
    
    {children.map((child, index) => (
  <div key={index} className="child-form-group">
    <div className="child-name-conteiner" style={{ justifyContent: "space-between", alignItems: "center" }}>
      <p className="child-description-light">Дитина {index + 1}</p>
      <button
        type="button"
        className="remove-child-button"
        onClick={() => removeChild(index)}       
      >
        ✖
      </button>
    </div>

    <input 
      className="input-field-child"
      type="text"
      placeholder="Ім’я дитини..."
      value={child.name}
      onChange={(e) => handleChildChange(index, "name", e.target.value)}    
    />

    <p className="bd-input-p">День народження</p>

      <div className="row-fields">
      
          <select
            className="select-field-day"
            value={child.day || ""}
            onChange={(e) => handleChildChange(index, "day", e.target.value)}
          >
            <option value="">День</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <div className={`select-wrapper ${isOpen ? "open" : ""}`}>
            <select
              className="select-field-month"
              name="birthMonth"
              value={child.month || ""}
              onChange={(e) => handleChildChange(index, "month", e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              required
            >
              <option value="">Місяць</option>
                {[
                  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
                  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
                ].map((month, i) => (
                  <option key={i} value={i + 1}>{month}</option>
                ))}
            </select>
          </div>

          <select
            className="select-field-year"
            value={child.year || ""}
            onChange={(e) => handleChildChange(index, "year", e.target.value)}
          >
            <option value="">Рік</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    ))}

<button type="button" className="add-child-button" onClick={addChild}>
      ДОДАТИ ДИТИНУ
    </button>

      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>        
      </div>
      <p className="description-light-leter">Заповнити пізніше</p>
    </div>
  );
};

export default Step2;