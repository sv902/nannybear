import React from "react";
import "../../styles/modal.css";

const DeleteBookingConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="overlay">
      <div className="bear-modal">
        <button className="modal-close-btn" onClick={onCancel}>✖</button>
        <h2 className="modal-title">ВИ ВПЕВНЕНІ?</h2>
        <p className="modal-text">
          Ця дія призведе до видалення запланованої зустрічі, і батьки будуть повідомлені про скасування.
        </p>
        <p className="modal-text">
          Якщо ви хочете змінити дату або час, то вам потрібно видалити поточну зустріч та домовитись про нову.
        </p>
        <p className="modal-text">
          Якщо ви скасовуєте зустріч менш ніж за 24 години — це може вплинути на вашу репутацію в сервісі.
        </p>
        <p className="modal-text">
          Будь ласка, скасовуйте зустрічі завчасно або в разі справжньої необхідності.
        </p>

        <div className="modal-buttons">
          <button className="btn-outline" onClick={onConfirm}>ВИДАЛИТИ ЗУСТРІЧ</button>
          <button className="btn-filled" onClick={onCancel}>СКАСУВАТИ</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingConfirmModal;
