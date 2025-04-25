import React from "react";

const SavedChangesModal = ({ onClose }) => (
  <div className="bear-modal-overlay">
    <div className="bear-modal">
      <div className="ear left-ear"></div>
      <div className="ear right-ear">
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      <div className="modal-content">
        <h3>Зміни збережено</h3>
        <p>Зміни збережено. Натискаючи "ДОБРЕ", <br /> ви погоджуєтесь з нашою політикою <br /> конфіденційності.</p>
        <div className="modal-buttons">
          <button className="ok-prof-btn" onClick={onClose}>Добре</button>
        </div>
      </div>
    </div>
  </div>
);

export default SavedChangesModal;
