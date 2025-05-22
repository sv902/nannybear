import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VariantHeader from "../components/Header/VariantHeader";
import Footer from "../components/Footer/Footer";
import axios from "../axiosConfig";
import "../styles/settings.css";

const ParentSettingsPage = () => {
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const [parent, setParentProfile] = useState(null);
    const [, setPressedButton] = useState(null);
   
    useEffect(() => {
        axios.get("/api/parent/profile")
          .then(res => setParentProfile(res.data.profile))
          .catch(err => console.error("❌ Помилка при завантаженні профілю:", err));
      }, []);

      const handleGoToSurvey = () => {
        navigate("/registration/parent/survey?from=edit");
      };

      const handleButtonClick = (buttonType) => {
        setPressedButton(buttonType); 
        setTimeout(() => setPressedButton(null), 200); 
      };

      const handleLogout = () => {
        handleButtonClick("logout");
        localStorage.removeItem("authToken");
        window.location.href = "/registrationlogin?section=login";
      }

    if (!parent) return <div>Завантаження...</div>;
 
      
  return (
    <div>
      <VariantHeader />
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
            src={
                parent?.photo_url
            }
            alt="Аватар"
            className="settings-avatar"
            />
        </div>
         <p className="parent-name-prof">{parent.first_name} <br/> {parent.last_name}</p>
            
        <div className="settings-buttons">
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/personal-info")}>
            Мої дані <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/location")}>
            Розташування <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/children")}>
            Діти <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/orders")}>
            Історія зустрічей <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={handleGoToSurvey}>
            Підбір няні <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/support")}>
            Служба підтримки <span className="arrow">&gt;</span>
            </button>
          <button className="settings-btn" onClick={() => navigate("/parent/profile/edit/password")}>
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

export default ParentSettingsPage;
