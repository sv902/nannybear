// components/NannyProfile/Step2.jsx
import React from "react";
import "../../styles/register.css";
import "../../styles/profileStep.css";

const Step2 = ({onNext, onBack}) => { 

    const handleNextClick = () => {    
      onNext();
    };
    
  return (
    <div className="email-confirmation-container">
     <button onClick={onBack} className="back-button">
      <span className="back-text">НАЗАД</span>
      <span className="back-arrow"></span>
    </button>
      <h1 className="title-light-full-page">Налаштування профілю</h1>
      <p className="description-light">
      Починається новий етап реєстрації! Будь ласка, вкажіть Ваші <br/>дані чесно, щоб знайти клієнтів, яким Ви ідеально підійдете. 
      <p></p>
      <br/> Дані можна буде змінити у будь-який час у розділі Налаштування<br/>профілю.
      </p>
      <div className="step-next-button">
        <button className="next-btn" onClick={handleNextClick}>
          ДАЛІ
        </button>
      </div>      
   </div>
  );
};

export default Step2;

