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
  const [selectedReason, setSelectedReason] = useState([]);
  const [details, setDetails] = useState("");
  const [profile, setProfile] = useState(null); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
 
  useEffect(() => {
    axios.get(`/api/profile/${id}`, { withCredentials: true })
  .then((res) => setProfile(res.data))
  .catch((err) => {
    console.error("❌ Не вдалося завантажити профіль:", err);
  });
  }, [id]);  

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
  
    if (selectedReason.length === 0) {
      alert("Оберіть хоча б одну причину.");
      return;
    }
  
    if (!details.trim()) {
      alert("Будь ласка, опишіть ситуацію.");
      return;
    }
  
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
  
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Помилка:", error);
      if (error.response?.status === 422) {
        alert("Некоректні дані. Перевірте, чи все заповнено правильно.");
      } else {
        alert("Помилка при надсиланні скарги.");
      }
    }
  };
  
  
  return (
    <div className="page-container">
      <VariantHeader />
  
      <div className="report-page">
        <button onClick={() => navigate(-1)} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
  
        <h1 className="title-report">Надіслати скаргу</h1>
        
        <div className="report-info">
            <div className="report-info-header">
              <h2>Деталі скарги</h2>
              <p className="text-admin">
                Адміністратор спочатку розгляне скаргу, перш ніж виносити попередження.
              </p>
            </div>

          {profile && (
            <div className="reported-profile">
              <p className="text-nanny-name">
                ОСКАРЖЕНИЙ ПРОФІЛЬ:  <strong className="name-nanny-report">{profile.first_name} {profile.last_name?.charAt(0)}.</strong>
              </p>
              <p className="text-nanny-name">
                ТИП АКАУНТУ: <strong className="name-role-report">{profile.role === 'parent' ? 'Батько/Мати' : 'Няня'}</strong>
              </p>
            </div>
          )}
        </div>
  
        <div className="report-title-row">
          <h3>Оберіть причину скарги</h3>
          <p className="required-label">обов’язкове поле</p>
        </div>

        <div className="report-content">
          <div className="form-wrapper">
            <div className="report-form">
            {reasons.map((reason, index) => (
            <label key={index} className="radio-option">
              <input
                type="checkbox"
                value={reason}
                checked={selectedReason.includes(reason)}
                onChange={() => {
                  setSelectedReason((prev) =>
                    prev.includes(reason)
                      ? prev.filter((r) => r !== reason)
                      : [...prev, reason]
                  );
                }}
              />
              {reason}
            </label>
          ))}      
            </div>
          </div>

          <div className="textarea-wrapper">
            <div className="textarea-block">
            <div className="textarea-header">
                <h3>Опишіть ситуацію</h3>
                <p className="required-label">обов’язкове поле</p>
              </div>

              <div className="textarea-container">
                <textarea
                  rows="6"
                  maxLength="1100"
                  placeholder="Опишіть, що саме трапилось, де й коли, хто брав участь, що порушено та які наслідки виникли..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
                <span className="char-counter">{details.length}/1100</span>
              </div>
            </div>
          </div>

          <div className="submit-container">
            <button type="submit" className="submit-report-btn" onClick={handleSubmit}>
              Відправити скаргу
            </button>
          </div>
        </div>

      </div>
      {showSuccessModal && (
  <div className="bear-modal-overlay-report">
    <div className="bear-modal-report">
      {/* Ліве вушко */}
      <div className="ear-report left-ear-report"></div>
      {/* Праве вушко */}
      <div className="ear-report right-ear-report">
        <button className="close-btn-report" onClick={() => setShowSuccessModal(false)}>✖</button>
      </div>

      <div className="modal-content-report">
        <h2>Дякуємо!</h2>
        <p>
          Ми цінуємо вашу уважність, адже це допомагає нам вдосконалювати наш сервіс і
          забезпечувати ще кращу якість послуг для всіх користувачів.
        </p>
        <button className="go-back-btn-report" onClick={() => navigate("/all-nannies")}>
          Повернутись до списку нянь
        </button>
      </div>
    </div>
  </div>
)}

  <div>
  <Footer />
  </div>
  
    </div>
  );
  
};

export default ReportProfilePage;

