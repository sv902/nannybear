import React from "react";
import "../../styles/ThankYouModal.css";

const EmailSubscribeModal = ({ onClose }) => {
  return (
    <div className="thank-you-overlay">
      <div className="thank-you-modal">
        <button className="modal-close-rev" onClick={onClose}>×</button>
        <h1 className="modal-title-rev">ДЯКУЄМО!</h1>
        <p className="modal-text-rev">
        ВИ ПІДПИСАЛИСЯ НА НАШУ EMAIL-РОЗСИЛКУ. 
        </p>
        <p className="modal-text-rev">
        ЧЕКАЙТЕ ПОВІДОМЛЕНЬ З НОВИНКАМИ <br/>
        ТА АКЦІЯМИ НА ВАШУ ПОШТОВУ СКРИНЬКУ!       
        </p>        
      </div>
    </div>
  );
};

export default EmailSubscribeModal;
