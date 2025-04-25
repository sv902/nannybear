import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import "../../styles/settings.css";

import eyeOpenDark from "../../icons/eye-open-dark.png";
import eyeClosedDark from "../../icons/eye-closed-dark.png";


const NannyChangePasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "", 
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [showSavedModal, setShowSavedModal] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");
      
        try {
          await axios.post("/api/change-password", formData);
          setSuccess("Пароль успішно змінено");
          setFormData({ current_password: "", new_password: "", new_password_confirmation: "" });
      
          setShowSavedModal(true); // ✅ Додай це
      
        } catch (err) {
          if (err.response?.data?.errors) {
            setErrors(err.response.data.errors);
          } else {
            setErrors({ general: "Сталася помилка" });
          }
        }
      };
      
  const isFormDirty = Object.values(formData).some(value => value.trim() !== "");

  const confirmExit = () => {
    setShowUnsavedModal(false);
    navigate(-1); // або navigate("/nanny/profile/edit");
  };
  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/nanny/profile/edit");
  };  

  return (
    <div>
    <VariantHeader />
    <div className="edit-page-container">
    <button onClick={() => {
         if (isFormDirty) {
            setShowUnsavedModal(true);
          } else {
            navigate(-1);
          }          
        }} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
      <h1 className="settings-title-pag">Зміна паролю</h1>

        <div className="password-form-edit-container">
      <form onSubmit={handleSubmit} className="password-form-edit">
        <label>ВВедіть старий пароль</label>
        <div className="password-input-wrapper">
        <input
            type={showPassword ? "text" : "password"}
            name="current_password"
            placeholder="Старий пароль..."
            value={formData.current_password}
            onChange={handleChange}
        />
         <button
            type="button"
            className="eye-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
        >
            <img src={showPassword  ? eyeOpenDark : eyeClosedDark} alt="eye" />
        </button>
        </div>
        {errors.current_password && <p className="error-text">{errors.current_password}</p>}

        <label>Придумайте новий пароль</label>
        <div className="password-input-wrapper">
        <input
           type={showPassword ? "text" : "password"}
            name="new_password"
            placeholder="Новий пароль..."
            value={formData.new_password}
            onChange={handleChange}
        />
            <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                <img src={showPassword  ? eyeOpenDark : eyeClosedDark} alt="eye" />
            </button>
        </div>
        {errors.new_password && <p className="error-text">{errors.new_password}</p>}

        <label>Повторіть новий пароль</label>
        <div className="password-input-wrapper">
        <input
              type={showPassword ? "text" : "password"}
            name="new_password_confirmation"
            placeholder="Новий пароль..."
            value={formData.new_password_confirmation}
            onChange={handleChange}
            />
         <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                <img src={showPassword  ? eyeOpenDark : eyeClosedDark} alt="eye" />
            </button>
        </div>
            {errors.new_password_confirmation && <p className="error-text">{errors.new_password_confirmation}</p>}


        {errors.general && <p className="error-text">{errors.general}</p>}
        {success && <p className="success-text">{success}</p>}
        <div className="save-btn-cont-location">
        <button type="submit" className="save-btn">зБЕРЕГТИ ЗМІНИ</button>
        </div>
      </form>
      </div>
      {showUnsavedModal && (
            <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={confirmExit} />
          )}

          {showSavedModal && (
            <SavedChangesModal onClose={handleSavedModalClose} />
          )}
    </div>
    
    <Footer />
    </div>
  );
};

export default NannyChangePasswordPage;
