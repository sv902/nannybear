import React from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step3 = ({ formData, setFormData, onBack, onSubmit }) => {
  const updateAddressField = (field, value) => {
    const updated = [...(formData.addresses || [{}])];
    updated[0] = {
      type: updated[0]?.type || "Дім", // тип адреси за замовчуванням
      ...updated[0],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: updated,
    }));
  };

  const address = formData.addresses?.[0] || {};

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
        <input
          className="input-field-reg"
          type="text"
          placeholder="Ваше місто..."
          value={address.city || ""}
          onChange={(e) => updateAddressField("city", e.target.value)}
          required
        />

        <p className="name-input-p">РАЙОН</p>
        <input
          type="text"
          placeholder="Ваш район..."
          value={address.district || ""}
          onChange={(e) => updateAddressField("district", e.target.value)}
          className="input-field-reg"
        />

        <p className="name-input-p">АДРЕСА</p>
        <input
          type="text"
          placeholder="Вулиця та номер будинку..."
          value={address.address || ""}
          onChange={(e) => updateAddressField("address", e.target.value)}
          className="input-field-reg"
        />

        <div className="row-fields">
          <div className="field-group">
            <p className="name-input-p">ПОВЕРХ</p>
            <input
              type="text"
              placeholder="№ поверху..."
              value={address.floor || ""}
              onChange={(e) => updateAddressField("floor", e.target.value)}
              className="input-field-reg"
            />
          </div>
          <div className="field-group">
            <p className="name-input-p">КВАРТИРА</p>
            <input
              type="text"
              placeholder="№ квартири..."
              value={address.apartment || ""}
              onChange={(e) => updateAddressField("apartment", e.target.value)}
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
