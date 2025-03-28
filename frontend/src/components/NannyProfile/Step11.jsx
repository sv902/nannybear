// components/NannyProfile/Step11.jsx

import React, { useState } from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step11 = ({ formData, setFormData, onBack, onSubmit }) => {
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const { city} = formData;
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const requiredFields = ["city", "district"];
    const hasEmpty = requiredFields.some((field) => !formData[field]?.trim());

    if (hasEmpty) {
      setError("Будь ласка, заповніть всі обов’язкові поля.");
      return;
    }

    // Якщо всі поля заповнені — передати дані далі
    onSubmit();
  };
  

  return (
    <div className="reg-form-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Ваша адреса</h1>
      <p className="description-light">Вкажіть ваше розташування, це допоможе батькам знаходити Вас.</p>

      <div className="step-form">
      <div className="name-conteiner">
        <p className="name-input-p left-label">МІСТО</p> 
        <p className="required-field right-required">обов’язкове поле</p>
      </div>
      <input className="input-field-reg"
        type="text"
        name="city"
        placeholder={city}
        value={formData.city || ""}
        onChange={handleChange}
        required
      />      

      <div className="name-conteiner">
        <p className="name-input-p left-label">РАЙОН</p> 
        <p className="required-field right-required">обов’язкове поле</p>
      </div>
        <input
          type="text"
          name="district"
          placeholder="Ваш район..."
          value={formData.district || ""}
          onChange={handleChange}
          className="input-field-reg"
          required
        />      
            {error && (
              <p style={{ color: "#FFFAEE", textAlign: "center", marginBottom: "15px" }}>
                {error}
              </p>
            )}

        <div className="step-next-button">
          <button className="reg-form-button next-btn" onClick={handleSubmit}>
            ДАЛІ
          </button>
        </div>
      </div>      
    </div>
  );
};

export default Step11;
