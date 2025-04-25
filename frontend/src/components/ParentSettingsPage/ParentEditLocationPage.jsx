import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import axios from "../../axiosConfig";
import "../../styles/settings.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";

const ParentEditLocationPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]); 
  const [editIndex, setEditIndex] = useState(null);
  const [newAddressMode, setNewAddressMode] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);


  useEffect(() => {
    axios.get("/api/parent/profile").then((res) => {
      const profile = res.data.profile;
      setAddresses(profile.addresses || []);
    });
  }, []);

  const handleAddAddress = () => {
    if (newAddressMode) {
      // Завершуємо режим додавання
      setEditIndex(null);
      setNewAddressMode(false);
    } else {
      // Додаємо нову адресу
      setAddresses(prev => [
        ...prev,
        { type: "", city: "", district: "", address: "", floor: "", apartment: "" }
      ]);
      setEditIndex(addresses.length);
      setNewAddressMode(true);
    }
  };
  

  const handleChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const handleRemove = (index) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const [parentData, setParentData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: ""
  });
  
  useEffect(() => {
    axios.get("/api/parent/profile").then((res) => {
      const profile = res.data.profile;
      setAddresses(profile.addresses || []);
      
      // Формуємо дату народження
      const birthDate = new Date(profile.birth_date);
      const birth_date = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
  
      setParentData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        birth_date: birth_date,
      });
    });
  }, []);
  

  const handleSave = () => {
    const payload = {
      first_name: parentData.first_name,
      last_name: parentData.last_name,
      phone: parentData.phone,
      birth_date: parentData.birth_date,
      addresses: addresses,
    };
    
    axios.post("/api/parent/profile", payload)
      .then(() => {
        setEditIndex(null);
        setNewAddressMode(false);
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
    navigate(-1); // або navigate("/parent/profile/edit");
  };
  
  const handleSavedModalClose = () => {
    setShowSavedModal(false);
    navigate("/parent/profile/edit");
  };  
  
  return (
    <div>
      <VariantHeader />
      <div className="edit-page-container">
      <button onClick={() => {
          if (editIndex !== null || newAddressMode) {
            setShowUnsavedModal(true);
          } else {
            navigate(-1);
          }
        }} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Розташування</h1>

        {addresses.map((address, index) => (
          <div key={index} className="address-block">
            {editIndex === index ? (
              <div className="address-edit-fields">
                <label>Тип</label>
                <input value={address.type} onChange={(e) => handleChange(index, "type", e.target.value)} placeholder="Тип (Дім / Робота...)" />
               
                <div className="name-container">
                  <label className="name-input-p left-label">МІСТО</label>
                  <p className="required-field right-required">обов’язкове поле</p>
                </div>
                <input          
                  type="text"
                  placeholder="Місто..."
                  value={address.city}
                  onChange={(e) => handleChange(index, "city", e.target.value)}
                  required
                />
                 <label>Район</label>
                <input placeholder="Ваш район..." value={address.district} onChange={(e) => handleChange(index, "district", e.target.value)} />
                <label>Адреса</label>
                <input placeholder="Вулиця та номер дому..." value={address.address} onChange={(e) => handleChange(index, "address", e.target.value)} />
                <div className="row-address-fields">
                  <div className="field-wrapper">
                    <label>Поверх</label>
                    <input
                      placeholder="№ поверху..."
                      value={address.floor}
                      onChange={(e) => handleChange(index, "floor", e.target.value)}
                    />
                  </div>
                  <div className="field-wrapper">
                    <label>Квартира</label>
                    <input
                      placeholder="№ квартири..."
                      value={address.apartment}
                      onChange={(e) => handleChange(index, "apartment", e.target.value)}
                    />
                  </div>
                </div>
               </div>
            ) : (
              <div className="address-row">
              <div className="address-view">
                <p className="address-type"><strong>{address.type || "—"}</strong></p>
                <p>{address.city || "—"}, {address.district || "—"}</p>
                <p>{address.address || "—"}</p>
                <p>Поверх: {address.floor || "—"}, Квартира: {address.apartment || "—"}</p>
              </div>
              <div className="address-actions">
                <button className="edit_address-btn" onClick={() => setEditIndex(index)}>Редагувати</button>
                <button className="rem-address-btn" onClick={() => handleRemove(index)}>✖</button>
              </div>
            </div>
            )}
          </div>
        ))}

      <div className="save-btn-cont-location"> 
        <button onClick={handleAddAddress} className="save-address-btn">
          {newAddressMode ? "Зберегти адресу" : "Додати адресу"}
        </button>
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

export default ParentEditLocationPage;
