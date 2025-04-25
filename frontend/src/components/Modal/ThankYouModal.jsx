import React from "react";
import "../../styles/ThankYouModal.css";

const ThankYouModal = ({ onClose }) => {
  return (
    <div className="thank-you-overlay">
      <div className="thank-you-modal">
        <button className="modal-close-rev" onClick={onClose}>×</button>
        <h1 className="modal-title-rev">ДЯКУЄМО!</h1>
        <p className="modal-text-rev">
          Нам надзвичайно приємно, що ви поділилися своїми враженнями про няню.
        </p>
        <p className="modal-text-rev">
          Ваші слова надихають та мотивують нас ставати ще кращими.
        </p>
        <button className="modal-button-rev" onClick={onClose}>
          ПОВЕРНУТИСЬ ДО СПИСКУ НЯНЬ
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
