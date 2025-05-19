import React from "react";
import animals from "../../assets/Qbunny.png"; 
import axios from "../../axiosConfig"; 
import { useNavigate } from "react-router-dom"; 

const SurveyStep14 = ({ onBack }) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const saved = localStorage.getItem("surveyData");
      if (!saved) {
        alert("Немає даних для надсилання.");
        return;
      }

      const data = JSON.parse(saved);

      const payload = {
        gender: data.preferred_gender,
        specialization: (data.nannyTypes || []).join(", "),
        work_schedule: (data.workingHours || []).join(", "),
        education: (data.nannyEducation || []).join(", "),
        languages: (data.languages || []).join(", "),
        additional_skills: (data.additionalSkills || []).join(", "),
        experience_years: data.experience_years,
        hourly_rate: data.hourly_rate,
      };
      console.log("📦 Дані до відправки: ", payload);

      const response = await axios.post("/api/nanny-preferences", payload, {
        withCredentials: true,
      });

      console.log("🎉 Дані збережено:", response.data);
      localStorage.removeItem("surveyData"); // можна очистити
      localStorage.removeItem("surveyStep");

      navigate("/nanny-profiles"); // переходимо до списку нянь
    } catch (error) {
      console.error("❌ Помилка при надсиланні даних:", error);
      alert("Сталася помилка при збереженні. Спробуйте ще раз.");
    }
  };

  return (
    <div>
      <button onClick={onBack} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <img className="animals-img" src={animals} alt="Веселі тваринки" />

      <h1 className="title-dark-survey">Гарна няня — це</h1>
      <p className="description-dark">інвестиція у щасливе дитинство та спокій батьків.</p>

      <div className="find-nanny-wrapper">
        <div className="find-nanny-combined">
          <button className="find-nanny-btn" onClick={handleSubmit}>
            ЗНАЙТИ НЯНЮ
          </button>
          <div className="arrow-circle" onClick={handleSubmit}>
            <span className="arrow-right">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyStep14;
