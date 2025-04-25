import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import "../../styles/register.css";
import "../../styles/settings.css";

const ParentEditChildrenPage = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [initialChildren, setInitialChildren] = useState([]);

  const [parentInfo, setParentInfo] = useState({
    first_name: "",
    phone: "",
    birth_date: ""
  });

  useEffect(() => {
    axios.get("/api/parent/profile").then((res) => {
      const profile = res.data.profile;
      const loadedChildren = profile.children || [];
      const formatted = loadedChildren.map((child) => {
        const date = new Date(child.birth_date);
        return {
          name: child.name || "",
          day: date.getDate().toString(),
          month: (date.getMonth() + 1).toString(),
          year: date.getFullYear().toString(),
        };
      });
      setChildren(formatted);
      setInitialChildren(JSON.parse(JSON.stringify(formatted)));
      setParentInfo({
        first_name: profile.first_name || "",
        phone: profile.phone || "",
        birth_date: profile.birth_date || "",
      });
    });
  }, []);

  const isChanged = () => {
    if (children.length !== initialChildren.length) return true;
    for (let i = 0; i < children.length; i++) {
      const current = children[i];
      const initial = initialChildren[i];      
      if (
        current.name !== initial.name ||
        current.day !== initial.day ||
        current.month !== initial.month ||
        current.year !== initial.year
      ) {
        return true;
      }
    }
    return false;
  };  

  const addChild = () => {
    if (children.length >= 14) {
      alert("Максимальна кількість дітей — 14");
      return;
    }
    setChildren((prev) => [...prev, { name: "", day: "", month: "", year: "" }]);
  };

  const removeChild = (index) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleSave = () => {
    const hasInvalid = children.some(
      (child) => !child.name || !child.day || !child.month || !child.year
    );

    if (hasInvalid) {
      alert("Будь ласка, заповніть усі поля або видаліть порожні.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", parentInfo.first_name);
    formData.append("phone", parentInfo.phone);
    formData.append("birth_date", parentInfo.birth_date);

    children.forEach((child, index) => {
      const birth_date = `${child.year}-${child.month.padStart(2, "0")}-${child.day.padStart(2, "0")}`;
      formData.append(`children[${index}][name]`, child.name);
      formData.append(`children[${index}][birth_date]`, birth_date);
    });

    axios
      .post("/api/parent/profile", formData)
      .then(() => setShowSavedModal(true))
      .catch((error) => {
        console.error("❌ Помилка збереження:", error);
        if (error.response?.status === 422) {
          const errors = error.response.data.errors;
          let message = "🚫 Помилка збереження:\n";
          for (const key in errors) {
            message += `• ${key}: ${errors[key].join(", ")}\n`;
          }
          alert(message);
        } else {
          alert("❌ Невідома помилка. Спробуйте ще раз.");
        }
      });
  };

  const confirmExit = () => {
    setShowUnsavedModal(false);
    navigate(-1);
  };

  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/parent/profile/edit");
  };

  return (
    <div>
      <VariantHeader />
      <div className="settings-page-container">
      <button
          onClick={() => {
            if (isChanged()) setShowUnsavedModal(true);
            else navigate(-1);
          }}
          className="back-button-dark"
        >
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Діти</h1>

        <div className="child-container">
        {children.map((child, index) => (
          <div key={index} className="child-form-group-edit">
            <div className="child-name-conteiner-edit">
              <p className="child-description-edit">Дитина {index + 1}</p>
              <button
                className="remove-child-button-edit"
                onClick={() => removeChild(index)}
              >
                ✖
              </button>
            </div>

            <input
              className="input-field-child-edit"
              type="text"
              placeholder="Ім’я дитини..."
              value={child.name}
              onChange={(e) => handleChildChange(index, "name", e.target.value)}
            />

            <p className="bd-input-p-edit">День народження</p>
            <div className="row-fields">
              <select
                className="select-field-day-edit"
                value={child.day}
                onChange={(e) => handleChildChange(index, "day", e.target.value)}
              >
                <option value="">День</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <div className={`select-wrapper-edit ${isOpen ? "open" : ""}`}>
                <select
                  className="select-field-month-edit"
                  value={child.month}
                  onChange={(e) => handleChildChange(index, "month", e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setIsOpen(false)}
                >
                  <option value="">Місяць</option>
                  {["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"].map((month, i) => (
                    <option key={i + 1} value={i + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <select
                className="select-field-year-edit"
                value={child.year}
                onChange={(e) => handleChildChange(index, "year", e.target.value)}
              >
                <option value="">Рік</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        
        <div className="save-btn-cont-child">
        <button type="button" className="save-address-btn" onClick={addChild}>ДОДАТИ ДИТИНУ</button>
        <button className="save-btn" onClick={handleSave}>ЗБЕРЕГТИ ЗМІНИ</button>
        </div></div>
      </div>

      {showUnsavedModal && (
        <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={confirmExit} />
      )}

      {showSavedModal && (
        <SavedChangesModal onClose={handleSavedModalClose} />
      )}

      <Footer />
    </div>
  );
};

export default ParentEditChildrenPage;
