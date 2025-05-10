import React, { useState, useEffect } from "react";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import axios from "../../axiosConfig";
import "../../styles/settings.css";

const specializationOptions = [
  { value: "Няня для немовляти" },
  { value: "Няня для доШкільнят" },
  { value: "Няня для школярів" },
  { value: "Няня-Гувернантка" },
  { value: "Няня погодинно" },
  { value: "Нічна няня" },
  { value: "Няня з проживанням" },
  { value: "Няня Супровід за кордон" },
  { value: "Няня для дитини з особливими потребами" },
  { value: "Няня-домогосподарка" },
  { value: "Няня постійної основи" },
];

const NannyEditSpecializationPage = () => {
  const [selected, setSelected] = useState([]);
  const [initial, setInitial] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const fromDB = res.data.profile.specialization || [];
      setSelected(fromDB);
      setInitial(fromDB);
    });
  }, []);

  const toggleSpecialization = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const isChanged = () => JSON.stringify(selected.sort()) !== JSON.stringify(initial.sort());

  const handleSave = () => {
    axios.post("/api/nanny/profile", { specialization: selected })
      .then(() => {
        setInitial([...selected]);
        setShowSavedModal(true);
      })
      .catch(() => alert("❌ Помилка збереження."));
  };

  const handleExit = () => {
    setShowUnsavedModal(false);
    window.history.back();
  };

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
        <button
          onClick={() => (isChanged() ? setShowUnsavedModal(true) : window.history.back())}
          className="back-button-dark"
        >
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Напрямки роботи</h1>

        <p className="select-nanny-lang">Обрані</p>
        <div className="options-row-nanny-spec">
          {specializationOptions
            .filter((opt) => selected.includes(opt.value))
            .map(({ value }) => (
              <button
                key={value}
                type="button"
                className="option-pill-nanny selected"
                onClick={() => toggleSpecialization(value)}
              >
                {value}
              </button>
            ))}
        </div>

        <p className="select-nanny-lang">Інші</p>
        <div className="options-row-nanny-spec">
          {specializationOptions
            .filter((opt) => !selected.includes(opt.value))
            .map(({ value }) => (
              <button
                key={value}
                type="button"
                className="option-pill-nanny"
                onClick={() => toggleSpecialization(value)}
              >
                {value}
              </button>
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

export default NannyEditSpecializationPage;
