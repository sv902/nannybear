import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import SavedChangesModal from "../Modal/SavedChangesModal";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";

const skillOptions = [
  "Допомога зі школою",
  "Розвиток дітей",
  "Кулінарія",
  "водіння машини",
  "прибирання",
  "розвиток творчості",
  "фізичний розвиток",
  "Догляд за хворою дитиною",
];

const NannyEditSkillsPage = () => {
  const [selected, setSelected] = useState([]);
  const [initial, setInitial] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const fromDB = res.data.profile.additional_skills || [];
      setSelected(fromDB);
      setInitial(fromDB);
    });
  }, []);

  const toggleSkill = (skill) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const isChanged = () =>
    JSON.stringify([...selected].sort()) !== JSON.stringify([...initial].sort());

  const handleSave = () => {
    axios
      .post("/api/nanny/profile", { additional_skills: selected })
      .then(() => {
        setInitial([...selected]);
        setShowSavedModal(true);
      })
      .catch(() => alert("Помилка збереження навичок"));
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

        <h1 className="settings-title-pag">Додаткові навички</h1>

        <p className="select-nanny-lang">Обрані</p>
        <div className="options-row-nanny-spec">
          {skillOptions
            .filter((s) => selected.includes(s))
            .map((skill) => (
              <button
                key={skill}
                className="option-pill-nanny selected"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
        </div>

        <p className="select-nanny-lang">Інші</p>
        <div className="options-row-nanny-spec">
          {skillOptions
            .filter((s) => !selected.includes(s))
            .map((skill) => (
              <button
                key={skill}
                className="option-pill-nanny"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
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

export default NannyEditSkillsPage;
