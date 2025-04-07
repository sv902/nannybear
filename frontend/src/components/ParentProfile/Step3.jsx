// components/ParentProfile/Step3.jsx
import React from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step3 = ({ formData, setFormData, onBack, onSubmit }) => {
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const { city} = formData;

  return (
    <div className="reg-form-container">
      <button onClick={onBack} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">Ваша адреса</h1>
      <p className="description-light">Будь ласка, вкажіть свою адресу для зручності.</p>

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

        <p className="name-input-p">РАЙОН</p>
        <input
          type="text"
          name="district"
          placeholder="Ваш район..."
          value={formData.district || ""}
          onChange={handleChange}
          className="input-field-reg"
        />

        <p className="name-input-p">АДРЕСА</p>
        <input
          type="text"
          name="address"
          placeholder="Вулиця та номер будинку..."
          value={formData.address || ""}
          onChange={handleChange}
          className="input-field-reg"
        />

        <div className="row-fields">
          <div className="field-group">
            <p className="name-input-p">ПОВЕРХ</p>
            <input
              type="text"
              name="floor"
              placeholder="№ поверху..."
              value={formData.floor || ""}
              onChange={handleChange}
              className="input-field-reg"
            />
          </div>
          <div className="field-group">
            <p className="name-input-p">КВАРТИРА</p>
            <input
              type="text"
              name="apartment"
              placeholder="№ квартири..."
              value={formData.apartment || ""}
              onChange={handleChange}
              className="input-field-reg"
            />
          </div>
        </div>

        <div className="step-next-button">
          <button className="reg-form-button next-btn" onClick={onSubmit}>
            ДАЛІ
          </button>
        </div>
      </div>
      <p className="description-light-leter">Заповнити пізніше</p>
    </div>
  );
};

export default Step3;
