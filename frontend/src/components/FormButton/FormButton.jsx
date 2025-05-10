import React, { useState } from "react";
import "./style.css";
import EmailSubscribeModal from "../Modal/EmailSubscribeModal";

export const FormButton = ({ className }) => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // TODO: API підписки
    setShowModal(true);
    setEmail("");
  };

  return (
    <>
      <form className={`form-button ${className}`} onSubmit={handleSubmit}>
  <div className="overlap-group-2">
    <div className="rectangle-4" />
    
    <input
      type="email"
      placeholder="Ваш email..."
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="email-input"
      required
    />

    <button type="submit" className="submit-arrow">
      {/* <img className="img" alt="Відправити" src="/assets/arrow-3.svg" /> */}
      <svg
  className="submit-arrow-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="16"
  viewBox="0 0 48 16"
  fill="none"
>
  <path
    d="M0 8H44M44 8L36 1M44 8L36 15"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>


    </button>
  </div>
</form>


      {showModal && <EmailSubscribeModal onClose={() => setShowModal(false)} />}
    </>
  );
};
