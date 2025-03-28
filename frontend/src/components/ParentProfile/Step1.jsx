// components/ParentProfile/Step1.jsx
import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step1 = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); 
  };

  const handleNextClick = () => {
    const requiredFields = [
      "firstName",     
      "city",
      "phone",
      "birthDay",
      "birthMonth",
      "birthYear"
    ];
    const hasEmpty = requiredFields.some(field => !formData[field]);

    if (hasEmpty) {
      setError("Будь ласка, заповніть всі обов’язкові поля.");
      return;
    }

    const phoneRegex = /^\+380\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Невірний формат номера телефону. Має бути +380XXXXXXXXX");
      return;
    }

    onNext(); // якщо все ок — переходимо
  };

  return <div className="reg-form-container">
    <h1 className="title-light-full-page">Персональна інформація</h1>
    <p className="description-light">Будь ласка, введіть свої особисті дані.</p>
    <div className="step-form">
    <div className="name-conteiner">
      <p className="name-input-p left-label">ІМ’Я</p> 
      <p className="required-field right-required">обов’язкове поле</p>
    </div>
      
      <input className="input-field-reg"
        type="text"
        name="firstName"
        placeholder="Ваше ім’я..."
        value={formData.firstName || ""}
        onChange={handleChange}
        required
      />
       <p className="name-input-p">ПРІЗВИЩЕ</p> 
      <input className="input-field-reg"
        type="text"
        name="lastName"
        placeholder="Ваше прізвище..."
        value={formData.lastName || ""}
        onChange={handleChange}   
      />
      <div className="name-conteiner">
        <p className="name-input-p left-label">МІСТО</p> 
        <p className="required-field right-required">обов’язкове поле</p>
      </div>
      <input className="input-field-reg"
        type="text"
        name="city"
        placeholder="Ваше місто..."
        value={formData.city || ""}
        onChange={handleChange}
        required
      />
      <div className="name-conteiner">
        <p className="name-input-p left-label">НОМЕР ТЕЛЕФОНУ</p> 
        <p className="required-field right-required">обов’язкове поле</p>
      </div>
      <div className="phone-wrapper">        
        <input
          className="input-field-reg phone-input"
          type="tel"
          name="phone"
          placeholder="+380 ХХ ХХХ ХХ ХХ"
          value={formData.phone || ""}
          onChange={handleChange}
          required
        />
        <img src={require("../../assets/ua-flag.png")} alt="UA Flag" className="flag-icon" />
      </div>
       <div className="dob-selects">
       <div className="name-conteiner">
        <p className="name-input-p left-label">ДАТА НАРОДЖЕННЯ</p> 
        <p className="required-field right-required">обов’язкове поле</p>
      </div>
      
        <select className="select-field-day" name="birthDay" value={formData.birthDay || ""} onChange={handleChange} required>
          <option value="">День</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

          <div className={`select-wrapper ${isOpen ? "open" : ""}`}>
            <select
              className="select-field-month"
              name="birthMonth"
              value={formData.birthMonth || ""}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              required
            >
              <option value="">Місяць</option>
              {months.map((month, i) => (
                <option key={i} value={i + 1}>{month}</option>
              ))}
            </select>
          </div>

        <select className="select-field-year" name="birthYear" value={formData.birthYear || ""} onChange={handleChange} required>
          <option value="">Рік</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
     
      {error && <p className="error-text" style={{ color: "#FFFAEE", marginBottom: "10px" }}>{error}</p>}
     
      <div className="step-next-button">
        <button className="reg-form-button" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>
    </div>
  </div>;
};

export default Step1;
