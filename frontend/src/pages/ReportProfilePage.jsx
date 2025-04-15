import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/report.css";

import VariantHeader from "../components/Header/VariantHeader";
import Footer from "../components/Footer/Footer";

const reasons = [
  "Перебільшення чи фальсифікація досвіду роботи",
  "Неправильно вказане місцезнаходження",
  "Перебільшені або вигадані мовні компетенції",
  "Оманлива інформація про спеціалізацію",
  "Хибне представлення професійних навичок",
  "Неточні або неправдиві відомості про освіту",
  "Поширення забороненого контенту",
  "Порушення домовленостей про послуги",
  "Небезпечна або неетична поведінка під час виконання обов’язків",
  "Недотримання правил сервісу",
  "Видавання себе за іншу особу (фейковий акаунт)"
];

const ReportProfilePage = () => {
    const navigate = useNavigate(); 
  const { id } = useParams(); 
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [profile, setProfile] = useState(null); 

  useEffect(() => {
    axios.get(`/api/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })
  .then((res) => setProfile(res.data))
  .catch((err) => {
    console.error("❌ Не вдалося завантажити профіль:", err);
  });
  }, [id]);  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        await axios.post(
            "/api/reports",
            {
              reported_user_id: id,
              reason: selectedReason,
              details,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );          
  
      alert("Скаргу надіслано!");
      navigate(-1);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при надсиланні скарги.");
    }
  };
  

  return (
    <div>
        <VariantHeader />  
        
     <div className="report-page">
        <button onClick={() => navigate(-1)} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
      <h1 className="title-report">Надіслати скаргу</h1>
      <section className="report-info">
        <h2>Деталі скарги</h2>
        <p className="text-admin">
          Адміністратор спочатку розгляне скаргу, перш ніж виносити
          попередження.
        </p>
        {profile && (
          <div className="reported-profile">
            <p className="text-nanny-name">Оскаржуваний профіль:  <strong>{profile.first_name} {profile.last_name?.charAt(0)}.</strong></p>
            <p className="text-nanny-name">Тип акаунту: <strong>{profile.role === 'parent' ? 'Батько/Мати' : 'Няня'}</strong></p>
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="report-form">
        <h3>Оберіть причину скарги <span style={{ color: "red" }}>*</span></h3>
        {reasons.map((reason, index) => (
          <label key={index} className="radio-option">
            <input
              type="radio"
              name="reason"
              value={reason}
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
              required
            />
            {reason}
          </label>
        ))}

        <h3>Опишіть ситуацію</h3>
        <textarea
          rows="6"
          placeholder="Введіть деталі ситуації..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className="submit-container">
          <button type="submit" className="submit-report-btn">
            Відправити скаргу
          </button>
        </div>
      </form>
      
    </div>
   
    <Footer/>
    </div>    
  );
};

export default ReportProfilePage;

