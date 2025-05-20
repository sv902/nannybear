import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";
import axios from "../axiosConfig";
import "../styles/settings.css";

const NannySettingsPage = () => {
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const [nanny, setNanny] = useState(null);
    const [, setPressedButton] = useState(null);
   
    useEffect(() => {
        axios.get("/api/nanny/profile")
          .then(res => setNanny(res.data.profile))
          .catch(err => console.error("❌ Помилка при завантаженні профілю:", err));
      }, []);
  
      const handleButtonClick = (buttonType) => {
        setPressedButton(buttonType); 
        setTimeout(() => setPressedButton(null), 200); 
      };

      const handleLogout = () => {
        handleButtonClick("logout");
        localStorage.removeItem("authToken");
        window.location.href = "/registrationlogin?section=login";
      }

    if (!nanny) {
  return (
    <div className="settings-page-container">
      <p>Завантаження профілю...</p>
    </div>
  );
}
 
      
  return (
    <div>
      <VariantHeaderNanny />
      <div className="settings-page-container">
        <div className="settings-header">
          <button onClick={() => navigate(-1)} className="back-button-dark">
            <span className="back-text">НАЗАД</span>
            <span className="back-arrow-dark"></span>
          </button>         
        </div>
        <h1 className="settings-title">Налаштування профілю</h1>
        <div className="avatar-section">       
         <img
            src={nanny.photo || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/nannies/default-avatar.jpg"}
            alt="Аватар"
            className="settings-avatar"
          />
        </div>
         <p className="parent-name-prof">{nanny.first_name} <br/> {nanny.last_name}</p>
            
        <div className="settings-buttons">
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/personal-info")}>
            Мої дані <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/location")}>
            Розташування <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/about")}>
            Про мене <span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/languages")}>
            Мови спілкування <span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/schedule")}>
            Графік роботи <span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/work-process")}>
            Як проходить робота <span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/specialization")}>
            Напрями роботи <span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/skills")}>
            Додаткові навички<span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/education")}>
            Освіта<span className="arrow">&gt;</span>
            </button>
            <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/gallery")}>
            Галерея<span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/history")}>
            Історія зустрічей <span className="arrow">&gt;</span>
            </button>        
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/support")}>
            Служба підтримки <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/nanny/profile/edit/password")}>
            Зміна паролю <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn"  onClick={handleLogout}>
            Вихід <span className="arrow">&gt;</span>
            </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NannySettingsPage;
