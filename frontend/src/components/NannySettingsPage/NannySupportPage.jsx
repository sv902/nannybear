import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";

const NannySupportPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут можна реалізувати запит до API або просто підтвердження
    setSent(true);
    setMessage("");
  };

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
        <button onClick={() => navigate(-1)} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
        <h1 className="settings-title-pag">Служба підтримки</h1>
        <p className="description-dark">Опишіть свою проблему або питання — ми з вами зв'яжемося!</p>
    <div className="support-form-container">
        <form onSubmit={handleSubmit} className="support-form">
          <textarea
            className="support-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишіть ваше повідомлення..."
            rows={6}
            required
          ></textarea>


          <div className="save-btn-cont-location">
        <button type="submit" className="save-btn">Відправити</button>
        </div>
          {sent && <p className="success-text">Дякуємо! Ваше повідомлення надіслано.</p>}
        </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NannySupportPage;
