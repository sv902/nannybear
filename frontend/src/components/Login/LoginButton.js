import React from "react";
import "../../styles/register.css";

const Login = ({ onClick }) => {
  return (
    <div className="login-button-container">
      <h1 className="title-dark">ВІТАЄМО ЗНОВУ!</h1>
      <p className="description-dark">
        Увійдіть в акаунт, щоб переглянути активні оголошення.
      </p>
      <button className="login-button" onClick={onClick}>
        ВХІД
    </button>
    </div>
  );
};

export default Login;
