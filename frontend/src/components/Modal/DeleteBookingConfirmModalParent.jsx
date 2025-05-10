import React from "react";
import "../../styles/modal.css";

const DeleteBookingConfirmModalParent = ({ onConfirm, onCancel }) => {
  return (
    <div className="overlay">
      <div className="bear-modal">
        <button className="modal-close-btn" onClick={onCancel}>✖</button>
        <h2 className="modal-title">ВИ ВПЕВНЕНІ?</h2>
        <p className="modal-text">
        Ця дія призведе до видалення запланованої зустрічі, і няню буде повідомлено про скасування. <br/>Адресу зустрічі можна змінити.
        </p>
        <p className="modal-text">
        Якщо ви хочете змінити дату або час потрібно видалити поточну зустріч
        та створити нову.
        </p>
        <p className="modal-text">
        Гроші буде повернено протягом 3 робочих днів (при умові оплати карткою).
        </p>
        <p className="modal-text">
        Увага! Якщо ви скасовуєте зустріч менш ніж за 24 години — кошти не повертаються.
        </p>

        <div className="modal-buttons">
          <button className="btn-outline" onClick={onConfirm}>ВИДАЛИТИ ЗУСТРІЧ</button>
          <button className="btn-filled" onClick={onCancel}>СКАСУВАТИ</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingConfirmModalParent;
