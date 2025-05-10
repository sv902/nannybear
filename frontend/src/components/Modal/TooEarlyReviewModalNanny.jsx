import React from "react";
import "../../styles/modal.css";

const TooEarlyReviewModalNanny = ({ onClose }) => (
  <div className="overlay">
    <div className="bear-modal-success">
      <button className="modal-close-btn" onClick={onClose}>X</button>
      <h2 className="modal-title">ПОМИЛКА!</h2>
      <p className="modal-text">
        Зустріч має відбутися, перш ніж Ви зможете оцінити батька/мати.
        <br />
        <br />
        Поверніться після завершення зустрічі!
      </p>
      <button className="btn-filled" onClick={onClose}>ДОБРЕ</button>
    </div>
  </div>
);

export default TooEarlyReviewModalNanny;
