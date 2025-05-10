import React from "react";
import "../../styles/modal.css";

const WorkingHoursModalFeedback = ({ type, onClose, onExit, onEdit }) => {
  const content = {
    success: {
      title: "ЗМІНИ ЗБЕРЕЖЕНО",
      text: "Зміни збережено успішно! Ваші робочі години оновлено — батьки тепер бачитимуть актуальний графік при пошуку няні.",
      buttons: [<button className="btn-filled" onClick={onClose}>ДОБРЕ</button>],
    },
    warning: {
      title: "УВАГА!",
      text: "Зміни в робочих годинах ще не збережено. Натисніть \"Зберегти зміни\", щоб не втратити оновлення.",
      buttons: [
        <div className="modal-buttons">
        <button className="btn-outline" onClick={onExit}>ВИЙТИ</button>
        <button className="btn-filled" onClick={onEdit}>РЕДАГУВАТИ</button>
     </div> ],
    },
    error: {
      title: "ПОМИЛКА!",
      text: "Ви не можете змінити робочі години, оскільки у вас вже запланована зустріч на цей час. Щоб оновити графік, спершу скасуйте зустріч.",
      buttons: [<button className="btn-filled" onClick={onClose}>ДОБРЕ</button>],
    },
  };

  const { title, text, buttons } = content[type] || {};

  return (
    <div className="overlay">
      <div className="bear-modal-success">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-text">{text}</p>
        <div className="button-group">{buttons}</div>
      </div>
    </div>
  );
};

export default WorkingHoursModalFeedback;
