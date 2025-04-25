import React from "react";

const UnsavedChangesModal = ({ onClose, onExit }) => (
  <div className="bear-modal-overlay">
    <div className="bear-modal">
      <div className="ear left-ear"></div>
      <div className="ear right-ear">
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="modal-content">
        <h2>Помилка!</h2>
        <p>Ви внесли зміни до свого профілю, які ще не збережено. Якщо ви зараз вийдете, ці зміни буде втрачено.</p>
        <div className="modal-buttons">
          <button className="exit-edit-btn" onClick={onExit}>Вийти</button>
          <button className="reg-prof-btn" onClick={onClose}>Редагувати</button>
        </div>
      </div>
    </div>
  </div>
);

export default UnsavedChangesModal;
