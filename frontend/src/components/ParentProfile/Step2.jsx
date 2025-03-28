// components/ParentProfile/Step2.jsx
import React from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step2 = ({ formData, setFormData, onNext, onBack }) => { 
  const children = formData.children || [];

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...children, { name: "", birth_date: "" }],
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
    const hasInvalid = children.some(child => !child.name || !child.birth_date);

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
    
    <button type="button" className="add-child-button" onClick={addChild}>
      ДОДАТИ ДИТИНУ
    </button>
    
    {children.map((child, index) => (
        <div key={index} className="child-form-group">
          <input
            type="text"
            placeholder="Ім’я дитини"
            value={child.name}
            onChange={(e) => handleChildChange(index, "name", e.target.value)}
            className="input-field-reg"
          />
          <input
            type="date"
            value={child.birth_date}
            onChange={(e) => handleChildChange(index, "birth_date", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="input-field-reg"
          />
          <button
            type="button"
            className="remove-child-button"
            onClick={() => removeChild(index)}
            style={{ marginTop: "5px", marginBottom: "20px" }}
          >
            Видалити
          </button>
        </div>
      ))}
      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>        
      </div>
      <p className="description-light">Заповнити пізніше</p>
    </div>
  );
};

export default Step2;