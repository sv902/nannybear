import React, { useState } from "react";
import axios from "../../axiosConfig";
import "../../styles/bookingModal.css";
import WorkingHoursModalFeedback from "./WorkingHoursModalFeedback";

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

const EditWorkingHoursModal = ({ date, initialHours = [], onClose, onSave }) => {
  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [modalType, setModalType] = useState(null);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const toggleHour = (hour) => {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort((a, b) => a.localeCompare(b))
    );
  };  

  const handleSave = async () => {
    try {
      const formattedDate = date.toISOString().split("T")[0];   
  
      if (selectedHours.length === 0) {
        await axios.delete(`/api/working-hours/${formattedDate}`);
        setModalType("success");
        return;
      }
  
      const sorted = [...selectedHours].sort((a, b) => a.localeCompare(b));
     
      const hourPairs = [];

      for (let i = 0; i < sorted.length - 1; i++) {
        const currentHour = parseInt(sorted[i]);
        const nextHour = parseInt(sorted[i + 1]);

        // Якщо години йдуть підряд — створюємо слот
        if (nextHour === currentHour + 1) {
          hourPairs.push({
            start_time: `${String(currentHour).padStart(2, "0")}:00`,
            end_time: `${String(nextHour).padStart(2, "0")}:00`,
          });
        }
      }
  
      if (hourPairs.length === 0) {
        setModalType("warning");
        return;
      }
  
      await axios.delete(`/api/working-hours/${formattedDate}`);
      await axios.post("/api/working-hours/bulk", {
        start_date: formattedDate,
        hours: hourPairs,
      });
  
      setModalType("success");
    } catch (error) {
      const err = error.response?.data;
      if (err?.message?.includes("зустріч")) {
        setModalType("error");
      } else {
        console.error("❌ Інша помилка:", err || error);
      }
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content-working-hours">
        <button className="close-button-modal" onClick={() => {
          if (selectedHours.length > 0) {
            setModalType("warning");
          } else {
            onClose();
          }
        }}>×</button>

        <h2>{date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}</h2>
        <p className="subtitle">РОБОЧІ ГОДИНИ</p>
        <p className="description">Оберіть час початку та кінець робочого дня.</p>

        <div className="hours-grid">
          {HOURS.map((hour) => {
            const hourInt = parseInt(hour);
            const hourDate = new Date(date);
            hourDate.setHours(hourInt, 0, 0, 0);
            const isPast = isToday && hourDate < now;

            return (
              <button
                key={hour}
                className={`hour-button ${selectedHours.includes(hour) ? "selected" : ""}`}
                disabled={isPast}
                onClick={() => !isPast && toggleHour(hour)}
              >
                {hour}
              </button>
            );
          })}
        </div>

        <div className="btn-cont">
          <button className="save-hours-btn" onClick={handleSave}>ЗБЕРЕГТИ ЗМІНИ</button>
        </div>
      </div>

      {modalType && (
        <WorkingHoursModalFeedback
          type={modalType}
          onClose={() => {
            if (modalType === "success") {
              onSave(selectedHours); 
              onClose();
            }
            setModalType(null);
          }}
          onExit={onClose}
          onEdit={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default EditWorkingHoursModal;
