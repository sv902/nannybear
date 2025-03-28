import React from "react";

const Register = ({ onClick }) => {
  return (
    <div className="register-button-container">
    <h1 className="title-dark">ЛАСКАВО ПРОСИМО!</h1>
    <p className="description-dark">
        Створіть акаунт, щоб  переглянути активні оголошення.
    </p>
    <button className="register-button" onClick={onClick}>
      РЕЄСТРАЦІЯ
    </button>
    </div>
  );
};

export default Register;
