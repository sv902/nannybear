import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";

const NannyEditWorkProcessPage = () => {
  const navigate = useNavigate();
  const [workProcess, setWorkProcess] = useState("");
  const [initialWorkProcess, setInitialWorkProcess] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const work = res.data.profile?.goat || "";
      setWorkProcess(work);
      setInitialWorkProcess(work);
      setCharCount(work.length);
    });
  }, []);

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setWorkProcess(text);
      setCharCount(text.length);
    }
  };

  const isChanged = () => workProcess !== initialWorkProcess;

  const handleSave = () => {
    axios
      .post("/api/nanny/profile", { goat: workProcess })
      .then(() => {
        setInitialWorkProcess(workProcess);
        setShowSavedModal(true);
      })
      .catch((err) => {
        alert("❌ Помилка збереження.");
        console.error(err);
      });
  };

  const confirmExit = () => {
    setShowUnsavedModal(false);
    navigate(-1);
  };

  const handleBackClick = () => {
    if (isChanged()) {
      setShowUnsavedModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/nanny/profile/edit");
  };

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
        <button onClick={handleBackClick} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
        <h1 className="settings-title-pag">Як проходить роботае</h1>
        <div className="nanny-prof-textarea-container">
        <textarea
          className="about-textarea-nanny"
          placeholder="Опишіть, як ви зазвичай проводите час із дітьми: чим займаєтесь, як будуєте день, які методи або підходи використовуєте. Це допоможе батькам зрозуміти, як саме ви працюєте!"
          value={workProcess}
          onChange={handleChange}
          rows="8"
        />
        <div className="char-counter-nanny">{charCount}/500</div>
        </div>
        <div className="save-btn-cont">
          <button className="save-btn" onClick={handleSave}>зБЕРЕГТИ ЗМІНИ</button>
        </div>

        {showUnsavedModal && (
          <UnsavedChangesModal
            onClose={() => setShowUnsavedModal(false)}
            onExit={confirmExit}
          />
        )}
        {showSavedModal && (
          <SavedChangesModal onClose={handleSavedModalClose} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NannyEditWorkProcessPage;
