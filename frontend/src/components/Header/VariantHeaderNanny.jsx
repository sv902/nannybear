import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hyperlink } from "../Hyperlink/Hyperlink.jsx";
import axios from "../../axiosConfig.js";
import "./variantheader.css";

import profileIcon from "../../assets/icons/profileIcon/profile.svg"; 
import notificationIcon from "../../assets/icons/profileIcon/notification.svg"; 
import questionIcon from "../../assets/icons/profileIcon/question.svg"; 
import logoutIcon from "../../assets/icons/profileIcon/logout.svg"; 

import profileSelectedIcon from "../../assets/icons/profileSelectedIcon/profile-selected.svg"; 
import notificationSelectedIcon from "../../assets/icons/profileSelectedIcon/notification-selected.svg"; 
import questionSelectedIcon from "../../assets/icons/profileSelectedIcon/question-selected.svg"; 
import logoutSelectedIcon from "../../assets/icons/profileSelectedIcon/logout-selected.svg"; 

import profilePressedIcon from "../../assets/icons/profilePressedIcon/profile-pressed.svg"; 
import notificationPressedIcon from "../../assets/icons/profilePressedIcon/notification-pressed.svg"; 
import questionPressedIcon from "../../assets/icons/profilePressedIcon/question-pressed.svg"; 
import logoutPressedIcon from "../../assets/icons/profilePressedIcon/logout-pressed.svg"; 

export const VariantHeaderNanny = () => {
  const [selectedButton, setSelectedButton] = useState(null); 
  const [pressedButton, setPressedButton] = useState(null); 
  const [hoveredButton, setHoveredButton] = useState(null); // Стан для наведення
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "nanny") {
      axios.get("/api/nanny/profile").then((res) => {
        const profile = res.data.profile;
        localStorage.setItem("nannyProfileId", profile.id);
      }).catch((err) => {
        console.error("Не вдалося отримати профіль няні:", err);
      });
    }
  }, []);
   
   
  const handleButtonClick = (buttonType) => {
    setPressedButton(buttonType); 
    setTimeout(() => setPressedButton(null), 200); 
  };

  const handleMouseEnter = (buttonType) => {
    setHoveredButton(buttonType); // Встановлюємо стан для наведення
  };

  const handleMouseLeave = () => {
    setHoveredButton(null); // Скидаємо стан при виході з кнопки
  };  
 
  const handleLogout = () => {
    handleButtonClick("logout");
    localStorage.removeItem("authToken");  
    window.location.href = "/registrationlogin?section=login";
  }

  const getProfileUrl = async () => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (!token) return "/registrationlogin?section=login";

  if (role === "nanny") {
    let profileId = localStorage.getItem("nannyProfileId");
    console.log("Айді в хедері:", profileId);
    if (!profileId) {
      try {
        const res = await axios.get("/api/nanny/profile");
        profileId = res.data.profile.id;
        localStorage.setItem("nannyProfileId", profileId);
        
      } catch (err) {
        console.error("Не вдалося отримати профіль няні", err);
        return "/registrationlogin?section=login";
      }
    }
    return `/nanny/profile/${profileId}`;
  }

  if (role === "parent") return "/parent-profiles";
  return "/registrationlogin?section=login";
};

const handleGoToSchedule = async () => {
  let profileId = localStorage.getItem("nannyProfileId");

  if (!profileId) {
    try {
      const res = await axios.get("/api/nanny/profile");
      profileId = res.data.profile.id;
      localStorage.setItem("nannyProfileId", profileId);
    } catch (err) {
      console.error("Не вдалося отримати профіль няні", err);
      alert("❌ Помилка отримання профілю няні");
      return;
    }
  }

  if (profileId) {
    navigate(`/nanny-schedule/${profileId}`);
  }
};



  return (
    <div className="header">
      <div className="overlap-group-3">
        <div className="menu">
          <Link className="logonannybear" to="/">
            <div className="logonannybeargrid">
              <div className="logo-wrapper">
                <div className="logo">
                  <img
                    className="ICON"
                    alt="Icon"
                    src="/assets/LogoNannyBear11.png"
                  />
                </div>
              </div>
            </div>
          </Link>
          <button
            className="all-nanny-btn"
            onClick={() => navigate("/nanny/profile/edit/hourly-rate")}
          >
            ЗАРОБІТОК
          </button>


          {/*Чат, Розклад, Сповіщення та Питання поки не активні*/}
          <Hyperlink className="h3-hyperlink" text="ЧАТ" />
          <button
            className="hyperlink-instance"
            onClick={handleGoToSchedule}
          >
            РОЗКЛАД
          </button>



        </div>
        <div className="icon-buttons">
          <button
            className={`icon-button ${selectedButton === "profile" ? "selected" : ""} ${pressedButton === "profile" ? "pressed" : ""}`}
            onClick={async () =>{
              setSelectedButton("profile");
              handleButtonClick("profile");
              const url = await getProfileUrl();
              navigate(url);
            }}
            onMouseEnter={() => handleMouseEnter("profile")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={hoveredButton === "profile" ? profileSelectedIcon : selectedButton === "profile" ? profileSelectedIcon : pressedButton === "profile" ? profilePressedIcon : profileIcon}
              alt="Профіль"
              className="icon"
            />
          </button>
          <button
            className={`icon-button ${selectedButton === "notification" ? "selected" : ""} ${pressedButton === "notification" ? "pressed" : ""}`}
            onClick={() => {
              setSelectedButton("notification");
              handleButtonClick("notification");
              window.location.href = "/notifications";
            }}
            onMouseEnter={() => handleMouseEnter("notification")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={hoveredButton === "notification" ? notificationSelectedIcon : selectedButton === "notification" ? notificationSelectedIcon : pressedButton === "notification" ? notificationPressedIcon : notificationIcon}
              alt="Сповіщення"
              className="icon"
            />
          </button>
          <button
            className={`icon-button ${selectedButton === "question" ? "selected" : ""} ${pressedButton === "question" ? "pressed" : ""}`}
            onClick={() => {
              setSelectedButton("question");
              handleButtonClick("question");
              window.location.href = "/questions";
            }}
            onMouseEnter={() => handleMouseEnter("question")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={hoveredButton === "question" ? questionSelectedIcon : selectedButton === "question" ? questionSelectedIcon : pressedButton === "question" ? questionPressedIcon : questionIcon}
              alt="Питання"
              className="icon"
            />
          </button>
          <button
            className={`icon-button ${pressedButton === "logout" ? "pressed" : ""}`}
            onClick={handleLogout}
            onMouseEnter={() => handleMouseEnter("logout")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={hoveredButton === "logout" ? logoutSelectedIcon : selectedButton === "logout" ? logoutSelectedIcon : pressedButton === "logout" ? logoutPressedIcon : logoutIcon}
              alt="Вихід"
              className="icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantHeaderNanny;
