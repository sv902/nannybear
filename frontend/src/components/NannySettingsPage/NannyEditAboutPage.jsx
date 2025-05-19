import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";

const NannyEditAboutPage = () => {
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState("");
  const [initialAboutMe, setInitialAboutMe] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const about = res.data.profile.about_me || "";
      setAboutMe(about);
      setInitialAboutMe(about);
      setCharCount(about.length);
    });
  }, []);

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);


  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setAboutMe(text);
      setCharCount(text.length);
    }
  };

  const isChanged = () => aboutMe !== initialAboutMe;

  const handleSave = () => {
    axios
      .post("/api/nanny/profile", { about_me: aboutMe })
      .then(() => {
        setInitialAboutMe(aboutMe);
        setShowSavedModal(true);
      })
      .catch((err) => {
        console.error("❌ Помилка:", err.response?.data || err);
        alert(err.response?.data?.message || "❌ Помилка збереження.");
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
        <h1 className="settings-title-pag">Про мене</h1>
        <div className="nanny-prof-textarea-container">
        <textarea
          className="about-textarea-nanny"
          placeholder="Розкажіть трохи про себе — що любите, який у вас досвід і чому вам подобається працювати з дітьми. Це допоможе батькам краще вас пізнати!"
          value={aboutMe}
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

export default NannyEditAboutPage;
