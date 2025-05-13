import React from "react";

const SavedChangesModal = ({ onClose }) => (
  <div className="bear-modal-overlay-saved">
    <div className="bear-modal-saved">
      <div className="ear-saved left-ear-saved"></div>
      <div className="ear-saved right-ear-saved">
        <button className="close-btn-saved" onClick={onClose}>✖</button>
      </div>
      <div className="modal-content-saved">
        <h3>Зміни збережено</h3>
        <p>Зміни збережено. Натискаючи "ДОБРЕ", <br /> ви погоджуєтесь з нашою політикою <br /> конфіденційності.</p>
        <div className="modal-buttons-saved">
          <button className="ok-prof-btn-saved" onClick={onClose}>Добре</button>
        </div>
      </div>
    </div>
  </div>
);

export default SavedChangesModal;
