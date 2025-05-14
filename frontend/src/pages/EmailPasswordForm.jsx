import React, { useState} from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import googleLogo from "../assets/google-cirkle-icon.png";
import facebookLogo from "../assets/facebook-cirkle-icon.png";
import eyeOpen from "../icons/eye-open.png";
import eyeClosed from "../icons/eye-closed.png";
import axios from '../axiosConfig';
import "../styles/register.css";

const EmailPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || localStorage.getItem("selectedRole") || "parent";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState({}); 

  const handleNext = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email || !password || !confirmPassword) {
      newErrors.general = "Заповніть всі поля";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Невалідний формат email";
    }   

    if (password.length < 8) {
      newErrors.password = "Введено неправильний пароль!";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Паролі не збігаються!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
      const response = await axios.post('/api/register', {
        email,
        password,
        password_confirmation: confirmPassword,
        role,
      });
    
      localStorage.setItem('userRole', role);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      navigate("/registration/email-confirmation", { state: { email } });
    
    } catch (error) {
      if (error.response?.data?.errors?.email?.[0] === "The email has already been taken.") {
        setErrors({ email: "Цей email вже зареєстрований" });
      } else {
        setErrors({ general: error.response?.data?.message || "Помилка реєстрації" });
      }
    }    
  };
 
  return (
    <div className="email-form-container">
      <button onClick={() => navigate(-1)} className="back-button">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow"></span>
      </button>
     
      <h1 className="title-light-full-page">реєстрація</h1>
      <p className="description-light">Ви перейшли на створення акаунту для...</p>
      <button className="role-info-btn" disabled>
        {role === "parent" ? "БАТЬКИ" : "НЯНЯ"}
      </button>
      
      <p className="description-light">Введіть Вашу пошту та придумайте <br></br> пароль для створеня профілю.</p>

      <div className="social-btn">
              <button className="google-login-btn login-icon">
                <img src={googleLogo} alt="Google" />
              </button>
              <button className="facebook-login-btn login-icon">
                <img src={facebookLogo} alt="Facebook" />
              </button>
            </div>
            <p className="description-light">або</p>
      <form className="register-form" onSubmit={handleNext}>
        <input 
          className={`input-field ${errors.email ? "input-error" : ""}`}      
          type="email" 
          placeholder="Ваш email..." 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        {/* {errors.email && <p className="error-text">{errors.email}</p>} */}
        
      <div className="password-container">
        <input 
          className={`input-field password-input ${errors.password ? "input-error" : ""}`}
          type={showPassword ? "text" : "password"}
          placeholder="Пароль..." 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        /> 
         <button 
            type="button" 
            className="show-password-btn" 
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? eyeOpen : eyeClosed} alt="toggle visibility" />
          </button>
      </div>
          {errors.password && <p className="error-text">{errors.password}</p>}       
        
      <div className="password-container">
        <input 
          className={`input-field password-input ${errors.confirmPassword ? "input-error" : ""}`}
          type={showPassword ? "text" : "password"}
          placeholder="Пароль..." 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <button 
            type="button" 
            className="show-password-btn" 
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? eyeOpen : eyeClosed} alt="toggle visibility" />
          </button>
      </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
      
        {errors.email && <p className="error-text">{errors.email}</p>}
        {errors.general && <p className="error-text">{errors.general}</p>}

        <button className="reg-form-button" type="submit">ДАЛІ</button>
      </form>
    </div>
  );
};

export default EmailPasswordForm;
