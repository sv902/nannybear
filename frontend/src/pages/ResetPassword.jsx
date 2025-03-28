import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import eyeOpen from "../icons/eye-open.png";
import eyeClosed from "../icons/eye-closed.png";
import "../styles/register.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Пароль має містити щонайменше 8 символів.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Паролі не співпадають.");
      return;
    }

    try {
      await axios.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Пароль успішно змінено!");
      setTimeout(() => navigate("/registrationlogin"), 2000);
    } catch (err) {
      setError("Помилка при зміні пароля. Спробуйте ще раз.");
    }
  };

  return (
    <div className="email-confirmation-container">
      <h1 className="title-light-full-page">Скидання пароля</h1>
      <form onSubmit={handleSubmit}>
        <div className="password-container">
          <input
            className="input-field password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Новий пароль..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? eyeOpen : eyeClosed} alt="toggle visibility" />
          </button>
        </div>

        <div className="password-container">
          <input
            className="input-field password-input"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Повторіть пароль..."
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <img src={showConfirmPassword ? eyeOpen : eyeClosed} alt="toggle visibility" />
          </button>
        </div>

        <button className="login-form-button" type="submit">
          Зберегти
        </button>

        {success && <p className="description-light">{success}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
