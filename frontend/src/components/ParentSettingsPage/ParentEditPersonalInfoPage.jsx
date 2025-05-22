import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import editIcon from "../../assets/icons/edit.svg";
import "../../styles/settings.css";
import "../../styles/report.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";


const ParentEditPersonalInfoPage = () => {
  const navigate = useNavigate();  

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    photo: null,
    children: [],
    floor: "1",
  });

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    axios.get("/api/parent/profile").then((res) => {
      const profile = res.data.profile;
      const birthDate = new Date(profile.birth_date);
      const day = birthDate.getDate().toString().padStart(2, "0");
      const month = (birthDate.getMonth() + 1).toString().padStart(2, "0");
      const year = birthDate.getFullYear().toString();

      const address = profile.addresses?.[0] || {};

      const updatedData = {
        ...profile,
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        children: profile.children || [],
        city: address.city || "",
        district: address.district || "",
        address: address.address || "",
        floor: address.floor?.toString() || "1",
        apartment: address.apartment || "",
      };

      setFormData((prev) => ({ ...prev, ...updatedData }));
      setInitialData(updatedData);
    });
  }, []);

  const isChanged = () => {
    if (!initialData) return false;
  
    const keys = ["first_name", "last_name", "phone"];
    const dateKeys = ["birthDay", "birthMonth", "birthYear"];
    const addressKeys = ["city", "district", "address", "floor", "apartment"];
  
    const basicChanged = keys.some(key => formData[key] !== initialData[key]);
    const dateChanged = dateKeys.some(key => String(formData[key]) !== String(initialData[key]));
    const addressChanged = addressKeys.some(key => String(formData[key]) !== String(initialData[key]));
  
    const photoChanged = formData.photo instanceof File;
      
    return basicChanged || dateChanged || addressChanged || photoChanged;
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };
  const validateInputs = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "Введіть ім’я";
    if (!formData.last_name) newErrors.last_name = "Введіть прізвище";
    if (!formData.phone) newErrors.phone = "Введіть номер телефону";
    else if (!/^\+380\d{9}$/.test(formData.phone)) newErrors.phone = "Формат має бути +380XXXXXXXXX";
    
    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
      newErrors.birth_date = "Оберіть дату народження";
    } else if (!isValidDate(formData.birthYear, formData.birthMonth, formData.birthDay)) {
      newErrors.birth_date = "Некоректна дата народження";
    }
  
    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors).join("\n"));
      return false;
    }
    return true;
  };
  
  const isValidDate = (year, month, day) => {
    const date = new Date(`${year}-${month}-${day}`);
    return (
      date.getFullYear().toString() === year &&
      (date.getMonth() + 1).toString().padStart(2, "0") === month &&
      date.getDate().toString().padStart(2, "0") === day
    );
  };

  const handleSave = () => {
    if (!isChanged()) return;
    if (!validateInputs()) return;

    const data = new FormData();
    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    }

    const { children, floor, birthDay, birthMonth, birthYear, ...rest } = formData;
    
    const day = formData.birthDay.toString().padStart(2, "0");
    const month = formData.birthMonth.toString().padStart(2, "0");
    const year = formData.birthYear.toString();

    const birth_date = `${year}-${month}-${day}`;
    data.append("birth_date", birth_date);


    data.append("birth_date", birth_date);

    if (floor) {
      data.append("floor", parseInt(floor, 10));
    }

    if (Array.isArray(children)) {
      children.forEach((child, index) => {
        if (child.name) data.append(`children[${index}][name]`, child.name);
        if (child.birth_date) data.append(`children[${index}][birth_date]`, child.birth_date);
      });
    }

    Object.entries(rest).forEach(([key, value]) => {      
      if (!["birth_date", "birthDay", "birthMonth", "birthYear", "photo", "children"].includes(key)) {
        data.append(key, value);
      }
    }); 
    
    data.append("addresses[0][type]", "дім");
    data.append("addresses[0][city]", formData.city || "");
    data.append("addresses[0][district]", formData.district || "");
    data.append("addresses[0][address]", formData.address || "");
    data.append("addresses[0][floor]", formData.floor || "");
    data.append("addresses[0][apartment]", formData.apartment || "");


    console.log("formData перед збереженням:", formData);
    console.log("Дата, яка буде надіслана:", birth_date);

    axios.post("/api/parent/profile", data)
      .then(() => setShowSavedModal(true))
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          let message = "Помилка збереження:\n";
          Object.entries(errors).forEach(([key, messages]) => {
            message += `• ${key}: ${messages.join(", ")}\n`;
          });
          alert(message);
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

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div>
      <VariantHeader />
      <div className="edit-page-container">
      <button onClick={() => {
        if (isChanged()) {
          setShowUnsavedModal(true);
        } else {
          navigate(-1);
        }
      }} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Мої дані</h1>

        <div className="avatar-edit-section">
          <label htmlFor="photo-upload" className="avatar-label">
            <img
              src={
                previewPhoto
                  ? previewPhoto
                  : formData.photo instanceof File
                    ? URL.createObjectURL(formData.photo)
                    : formData.photo || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"
              }
              alt="Аватар"
              className="settings-avatar"
            />
            <img src={editIcon} alt="Редагувати" className="edit-icon" />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        <div className="edit-form">
          <label>Ім’я</label>
          <input type="text" name="first_name" placeholder="Ваше ім’я..." value={formData.first_name} onChange={handleChange} />

          <label>Прізвище</label>
          <input type="text" name="last_name" placeholder="Ваше прізвище..." value={formData.last_name} onChange={handleChange} />

          <label>Номер телефону</label>
          <input type="text" name="phone" placeholder="+380 ХХ ХХХ ХХ ХХ" value={formData.phone} onChange={handleChange} />

          <label>Дата народження</label>
          <div className="dob-selects">
            <select className="select-day" name="birthDay" value={formData.birthDay} onChange={handleChange}>
              <option value="">День</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <select className="select-month" name="birthMonth" value={formData.birthMonth} onChange={handleChange}>
              <option value="">Місяць</option>
              {months.map((month, i) => (
                <option key={month} value={month}>{new Date(0, i).toLocaleString("uk", { month: "long" })}</option>
              ))}
            </select>

            <select className="select-year" name="birthYear" value={formData.birthYear} onChange={handleChange}>
              <option value="">Рік</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="save-btn-cont">
            <button className="save-btn" onClick={handleSave}>Зберегти зміни</button>
          </div>
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

export default ParentEditPersonalInfoPage;
