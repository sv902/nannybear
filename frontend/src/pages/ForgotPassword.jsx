import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // для переходів

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");  

    try {
    const res = await axios.post("/api/forgot-password", { email });
      if (res.status === 200) {
        setMessage("Посилання для відновлення пароля надіслано на вашу пошту.");
        setTimeout(() => navigate(-1), 2000); // повернення на попередню сторінку
      }
    } catch (err) {
      setError("Сталася помилка. Спробуйте ще раз.");
    }
  };

  return (
    <div className="email-confirmation-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>

      <h1 className="title-light-full-page">ВІДНОВЛЕННЯ ПАРОЛЯ</h1>
      <p className="description-light">
        Введіть свою електронну пошту та ми надішлемо інструкції.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="login-form-input"
          type="email"
          placeholder="Ваш email...."
          value={email}
          onChange={(e) => setEmail(e.target.value)}       
          required
        />
        <button className="login-form-button" type="submit">
          ДАЛІ
        </button>
        {message && <p className="description-light">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
