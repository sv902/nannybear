import React from "react";

const SalarySavedModal = ({ onClose }) => {
return (
  <div className="overlay">
    <div className="bear-modal-success">
        <button className="modal-close-btn" onClick={onClose}>✖</button>
      <div >
        <h3 className="modal-title">ЗМІНИ ЗБЕРЕЖЕНО</h3>
        <p className="modal-text">
          Нову оплату за годину збережено.<br />
          Дякуємо, що оновлюєте свій профіль!
        </p>
        <div className="modal-buttons">
          <button className="btn-filled" onClick={onClose}>ДОБРЕ</button>
        </div>
      </div>
    </div>
  </div>
);
};
export default SalarySavedModal;
