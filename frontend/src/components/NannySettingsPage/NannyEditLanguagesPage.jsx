import React, { useEffect, useState, useMemo } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHederNanny from "../../components/Header/VariantHederNanny";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import "../../styles/settings.css";

const NannyEditLanguagesPage = () => {
  const navigate = useNavigate();

  const MAX_LANGUAGES = 10;
  const predefinedLanguages = useMemo(() => [
    { code: "uk", name: "Українська", flag: "https://flagcdn.com/w40/ua.png" },
    { code: "gb", name: "Англійська", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "de", name: "Німецька", flag: "https://flagcdn.com/w40/de.png" },
    { code: "fr", name: "Французька", flag: "https://flagcdn.com/w40/fr.png" },
    { code: "pl", name: "Польська", flag: "https://flagcdn.com/w40/pl.png" },
    { code: "es", name: "Іспанська", flag: "https://flagcdn.com/w40/es.png" },
  ], []);
  
  const [customLanguages, setCustomLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [initialLanguages, setInitialLanguages] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newLang, setNewLang] = useState("");

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const fromDB = res.data.profile.languages || [];
      const known = fromDB.filter((lang) => predefinedLanguages.some((p) => p.name === lang));
      const custom = fromDB.filter((lang) => !known.includes(lang));
      setSelectedLanguages(known);
      setCustomLanguages(custom);
      setInitialLanguages([...known, ...custom]);
    });
  }, [predefinedLanguages]); 

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const isChanged = () => {
    const current = [...selectedLanguages, ...customLanguages.filter(Boolean)].sort();
    const initial = [...initialLanguages].sort();
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const confirmExit = () => {
    setShowUnsavedModal(false);
    navigate(-1);
  };

  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/nanny/profile/edit");
  };

  const handleSave = () => {
    const allLanguages = [...selectedLanguages, ...customLanguages.filter(Boolean)];
    if (allLanguages.length === 0) {
      alert("Будь ласка, оберіть мови.");
      return;
    }
    if (allLanguages.length > MAX_LANGUAGES) {
      alert(`Максимум ${MAX_LANGUAGES} мов.`);
      return;
    }

    axios.post("/api/nanny/profile", { languages: allLanguages })
      .then(() => setShowSavedModal(true))
      .catch(() => alert("Помилка збереження."));
  };

  return (
    <div>
      <VariantHederNanny />
      <div className="edit-page-container">
        <button onClick={() => {
          if (isChanged()) setShowUnsavedModal(true);
          else navigate(-1);
        }} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Мови спілкування</h1> 
        <div className="lang-nany-prof-container">
        <p className="select-nanny-lang">Обрані</p>
            <div className="options-row-lang">
            {/* стандартні обрані мови */}
            {predefinedLanguages
                .filter(({ name }) => selectedLanguages.includes(name))
                .map(({ name, flag }) => (
                <button
                    key={name}
                    type="button"
                    className="option-pill selected"
                    onClick={() => toggleLanguage(name)}
                >
                    <img src={flag} alt={name} style={{ width: "24px", marginRight: "8px" }} />
                    {name}
                </button>
                ))}

            {/* додаткові (кастомні) мови з хрестиком */}
            {customLanguages.map((lang, index) => (
                <button
                key={index}
                type="button"
                className="option-pill selected"
                style={{ position: "relative", paddingRight: "40px" }}
                >
                {lang}
                <span
                    onClick={() => {
                    setCustomLanguages((prev) => prev.filter((_, i) => i !== index));
                    setSelectedLanguages((prev) => prev.filter((l) => l !== lang));
                    }}
                    style={{
                    position: "absolute",
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 20 20">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#FFFAEE" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
                </button>
            ))}
            </div>

            <p className="select-nanny-lang">Інші</p>
            <div className="options-row-lang">
            {predefinedLanguages
                .filter(({ name }) => !selectedLanguages.includes(name))
                .map(({ name, flag }) => (
                <button
                    key={name}
                    type="button"
                    className="option-pill"
                    onClick={() => toggleLanguage(name)}
                >
                    <img src={flag} alt={name} style={{ width: "24px", marginRight: "8px" }} />
                    {name}
                </button>
                ))}
            </div>

            <div className="add-larg-block">
            <p className="lang-description-nanny">Немає мови, якою Ви володієте? Додайте нижче.</p>

            {showInput ? (
            <div className="lang-form-wrapper-nnany">
                <input
                type="text"
                className="lang-input-nanny-prof"
                placeholder="Ваша мова спілкування..."
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                />
                <button
                type="button"
                className="remove-lang-btn-nanny"
                onClick={() => {                    
                    setShowInput(false);
                    setNewLang("");
                }}
                >
                ✖
                </button>
                <div className="option-pill-nanny-prof"> 
                <button
                className="option-pill-nanny-prof-btn"
                onClick={() => {
                    const trimmed = newLang.trim();
                    const totalCount = selectedLanguages.length + customLanguages.filter(Boolean).length;
                    if (trimmed && !selectedLanguages.includes(trimmed)) {
                    if (totalCount >= MAX_LANGUAGES) {
                        alert(`Максимум ${MAX_LANGUAGES} мов.`);
                        return;
                    }

                    setCustomLanguages((prev) => [...prev, trimmed]);
                    setSelectedLanguages((prev) => [...prev, trimmed]);
                    setNewLang("");
                    setShowInput(false);              
                    }
                }}
                >
                ДОДАТИ ДО ОБРАНИХ
                </button>
            </div>  </div>
            ) : (
             <div className="option-pill-nanny-prof"> 
            <button
                type="button"
                className="option-pill-nanny-prof-btn"
                onClick={() => {
                    const totalCount = selectedLanguages.length + customLanguages.filter(Boolean).length;
                    if (totalCount >= MAX_LANGUAGES) {
                      alert(`Максимум ${MAX_LANGUAGES} мов.`);
                      return;
                    }
                    setShowInput(true);
                  }}                  
            >
                ДОДАТИ МОВУ СПІЛКУВАННЯ
            </button>
            </div>  
            )}
            </div>

            </div> 

        <div className="save-btn-cont">
          <button className="save-btn" onClick={handleSave}>зБЕРЕГТИ ЗМІНИ</button>
        </div>

        {showUnsavedModal && (
          <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={confirmExit} />
        )}

        {showSavedModal && (
          <SavedChangesModal onClose={handleSavedModalClose} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NannyEditLanguagesPage;
