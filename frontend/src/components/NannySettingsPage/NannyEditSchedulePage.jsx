import React, { useState, useEffect } from "react";
import VariantHederNanny from "../../components/Header/VariantHederNanny";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import axios from "../../axiosConfig";
import "../../styles/settings.css";

const scheduleOptions = [
  { label: "Погодинно", subtitle: "1–3 години" },
  { label: "Неповний день", subtitle: "4–7 годин" },
  { label: "Повний день", subtitle: "8+ годин" },
  { label: "Нічні зміни", subtitle: "нічна няня" },
];

const NannyEditSchedulePage = () => {
  const [selected, setSelected] = useState([]);
  const [initial, setInitial] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    axios.get("/api/nanny/profile")
      .then((res) => {
        const fromDB = res.data.profile?.work_schedule || [];
        setSelected(fromDB);
        setInitial(fromDB);
      })
      .catch(() => {
        alert("Не вдалося завантажити графік роботи");
      });
  }, []);
  

  const toggleSchedule = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isChanged = () => {
    return JSON.stringify(selected.sort()) !== JSON.stringify(initial.sort());
  };

  const handleSave = () => {
    axios.post("/api/nanny/profile", { work_schedule: selected })
      .then(() => {
        setInitial([...selected]);
        setShowSavedModal(true);
      })
      .catch(() => alert("Помилка збереження графіку"));
  };

  const handleExit = () => {
    setShowUnsavedModal(false);
    window.history.back();
  };

  return (
    <div>
      <VariantHederNanny />
      <div className="edit-page-container">
        <button
          onClick={() => (isChanged() ? setShowUnsavedModal(true) : window.history.back())}
          className="back-button-dark"
        >
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Графік роботи</h1>

        <p className="select-nanny-lang">Обрані</p>
        <div className="options-row-nanny">
          {scheduleOptions
            .filter((opt) => selected.includes(opt.label))
            .map(({ label, subtitle }) => (
              <div key={label} className="option-schedule-wrapper">
                <button
                  type="button"
                  className="option-pill-nanny selected"
                  onClick={() => toggleSchedule(label)}
                >
                  {label}
                </button>
                <p className="schedule-subtitle">{subtitle}</p>
              </div>
            ))}
        </div>

        <p className="select-nanny-lang">Інші</p>
        <div className="options-row-nanny">
          {scheduleOptions
            .filter((opt) => !selected.includes(opt.label))
            .map(({ label, subtitle }) => (
              <div key={label} className="option-schedule-wrapper">
                <button
                  type="button"
                  className="option-pill-nanny"
                  onClick={() => toggleSchedule(label)}
                >
                  {label}
                </button>
                <p className="schedule-subtitle">{subtitle}</p>
              </div>
            ))}
        </div>

        <div className="save-btn-cont">
          <button className="save-btn" onClick={handleSave}>ЗБЕРЕГТИ ЗМІНИ</button>
        </div>

        {showUnsavedModal && (
          <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={handleExit} />
        )}
        {showSavedModal && (
          <SavedChangesModal onClose={() => setShowSavedModal(false)} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NannyEditSchedulePage;