import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VariantHederNanny from "../../components/Header/VariantHederNanny";
import Footer from "../../components/Footer/Footer";
import axios from "../../axiosConfig";
import "../../styles/settings.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";

const NannyEditLocationPage = () => {
  const navigate = useNavigate();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const [nannyData, setNannyData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const profile = res.data.profile;
      const birthDate = new Date(profile.birth_date);
      const birth_date = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
  
      const updatedData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        birth_date,
        city: profile.city || "",
        district: profile.district || ""
      };
  
      setNannyData(updatedData);
      setInitialData({
        city: updatedData.city,
        district: updatedData.district
      });
    });
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNannyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios.post("/api/nanny/profile", nannyData)
      .then(() => {
        setShowSavedModal(true);
      })
      .catch((err) => {
        console.error("❌ Помилка збереження адрес:", err);
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;
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

  const isChanged = () => {
    return (
      nannyData.city !== initialData.city ||
      nannyData.district !== initialData.district
    );
  };

  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/nanny/profile/edit");
  };
 
  return (
    <div>
      <VariantHederNanny />
      <div className="edit-page-container">
      <button onClick={() => {
         if (!initialData || !isChanged()) {
          navigate(-1);
        } else {
          setShowUnsavedModal(true);
        }          
        }} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Розташування</h1>
        <div className="address-block">
        <div className="address-edit-fields-nanny">
          <div className="name-container">
            <label className="name-input-p left-label">МІСТО</label>
            <p className="required-field right-required">обов’язкове поле</p>
          </div>
          <input
            type="text"
            name="city"
            placeholder="Місто..."
            value={nannyData.city}
            onChange={handleChange}
            required
          />

          <label>Район</label>
          <input
            type="text"
            name="district"
            placeholder="Ваш район..."
            value={nannyData.district}
            onChange={handleChange}
          /></div>
        </div>

        <div className="save-btn-cont-location-nanny">
          <button onClick={handleSave} className="save-btn">Зберегти зміни</button>
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

export default NannyEditLocationPage;
