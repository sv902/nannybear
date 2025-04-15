import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BearDefault from "../../assets/Group21.png";
import BearHovered from "../../assets/Group23.png";


const RegisterForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedRole, setSelectedRole] = useState("parent"); 

  const handleNext = () => {
    navigate("/registration/email", { state: { role: selectedRole } });
  };

  return (
    <div className="right-form-container">
      <h1 className="title-light">СТВОРЕННЯ АКАУНТУ</h1>
      <p className="question">ОБЕРІТЬ ТИП АКАУНТУ</p>          
      
      <div className="buttons-container">
        <button
          className={`role-button ${selectedRole === "parent" ? "active" : ""}`}
          onClick={() => setSelectedRole("parent")}
        >
          БАТЬКИ
        </button>
        <button
          className={`role-button ${selectedRole === "nanny" ? "active" : ""}`}
          onClick={() => setSelectedRole("nanny")}
        >
          НЯНЯ
        </button>
      </div>
      
      <p className="description-light">
        Батьки можуть бронювати замовлення,<br></br> 
        а няні шукати клієнтів. 
      </p>
      
      <div className="bear-button-container">
        <img
            className="img-bear"
            src={isHovered ? BearHovered : BearDefault}
            alt="Ведмедик"
          />
          <button
            className="next-button"
            onClick={handleNext}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            СТВОРИТИ АКАУНТ
          </button>
        </div>
    </div>
  );
};
export default RegisterForm;
