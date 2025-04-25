// components/ParentSurvey/SurveyStep1.jsx 
import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../../styles/register.css";
import "../../styles/profileStep.css";
import "../../styles/survey.css";
import animals from "../../assets/bear-error.png";

const SurveyStep1 = ({onNext}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const from = query.get("from");

  const handleBack = () => {
    if (from === "nanny-list") {
      navigate("/nanny-profiles");
    } else if (from === "settings") {
      navigate("/parent-profiles");
    } else if (from === "edit") {
      navigate("/parent/profile/edit");
    } else {
      navigate("/registration/parent/profile?step=3");
    }
  };

  return <div className="survey-container-global">
     <button onClick={handleBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>
    <img className="animals-img" src={animals} alt="Веселі тваринки"></img>
    <h1 className="title-dark-survey">Вітаємо на nanny bear</h1>
    <p className="description-dark-survey">Знайдіть свою няню за 5 хвилин</p>
    <p className="text-dark-survey">
    Ми хочемо допомогти швидко і зручно знайти ідеальну няню для Вашої сім’ї. <br/>
    Цей короткий опитувальник допоможе нам зрозуміти ваші потреби та одразу <br/>
    налаштувати фільтри, щоб ви бачили лише найвідповідніші варіанти.<br/>
    Заповніть кілька питань – і ми підберемо для вас найкращих нянь! 
    </p>

    <div className="find-nanny-wrapper">
    <div className="find-nanny-combined">
        <button className="find-nanny-btn" onClick={onNext}>
          ЗНАЙТИ НЯНЮ
        </button>
        <div className="arrow-circle" onClick={onNext}>
          <span className="arrow-right">&rarr;</span>
        </div>
      </div>
    </div>

    <p className="description-light-leter">
      <span
        onClick={() => {
          if (from === "nanny-list") {
            navigate("/nanny-profiles");
          } else if (from === "settings") {
            navigate("/parent-profiles");
          } else if (from === "edit") {
            navigate("/parent/profile/edit");
          } else {
            navigate("/"); // або інша логіка за замовчуванням
          }
        }}
        style={{ textDecoration: "underline", color: "#3A3B61", cursor: "pointer" }}
      >
        Заповнити пізніше
      </span>
    </p>

  </div>;
};

export default SurveyStep1;
