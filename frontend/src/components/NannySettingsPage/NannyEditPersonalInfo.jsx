import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import editIcon from "../../assets/icons/edit.svg";
import "../../styles/settings.css";
import "../../styles/report.css";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";


const NannyEditPersonalInfo = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    photo: null,
  });

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      const profile = res.data.profile;
      const birthDate = new Date(profile.birth_date);
      const day = birthDate.getDate().toString().padStart(2, "0");
      const month = (birthDate.getMonth() + 1).toString().padStart(2, "0");
      const year = birthDate.getFullYear().toString();

      const updatedData = {
        ...profile,
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        city: profile.city || "",
        district: profile.district || "",
        gender: profile.gender || "female",
        experience_years: profile.experience_years || 0,
        hourly_rate: profile.hourly_rate || 0,
        specialization: profile.specialization || [],
        work_schedule: profile.work_schedule || [],
        languages: profile.languages || [],
        additional_skills: profile.additional_skills || [],
        availability: profile.availability || [],
        video: null,
        gallery: [],
      };      

      setFormData((prev) => ({ ...prev, ...updatedData }));
      setInitialData({
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        phone: updatedData.phone,
        birthDay: day,
        birthMonth: month,
        birthYear: year,
        photo: updatedData.photo ?? null,
      });
    });
  }, []);
  const isChanged = () => {
    if (!initialData) return false;
  
    const fieldsToCheck = ["first_name", "last_name", "phone"];
    const dateFields = ["birthDay", "birthMonth", "birthYear"];
  
    const basicChanged = fieldsToCheck.some(key => formData[key] !== initialData[key]);
    const dateChanged = dateFields.some(key => String(formData[key]) !== String(initialData[key]));
    const photoChanged = formData.photo instanceof File;
    
    return basicChanged || dateChanged || photoChanged;
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
  
    // 📸 Фото
    if (formData.photo instanceof File) {
      data.append("photo", formData.photo);
    }
  
    // 📅 Дата народження
    const day = formData.birthDay.toString().padStart(2, "0");
    const month = formData.birthMonth.toString().padStart(2, "0");
    const year = formData.birthYear.toString();
    const birth_date = `${year}-${month}-${day}`;
    data.append("birth_date", birth_date);
  
    // 🧩 Поля, які вимагає бекенд
    const requiredFields = [
      "first_name", "last_name", "phone",
      "city", "district", "gender",
      "experience_years", "hourly_rate"
    ];
  
    requiredFields.forEach((key) => {
      const value = formData[key];
      if (value !== undefined && value !== null && value !== "") {
        data.append(key, value);
      }
    });
  
    // ✅ Масиви: specialization, work_schedule, languages, additional_skills
    const appendArray = (arr, key) => {
      if (Array.isArray(arr) && arr.length > 0) {
        arr.filter(item => typeof item === "string" && item.trim() !== "")
          .forEach((item, idx) => data.append(`${key}[${idx}]`, item));
      }
    };
  
    appendArray(formData.specialization, "specialization");
    appendArray(formData.work_schedule, "work_schedule");
    appendArray(formData.languages, "languages");
    appendArray(formData.additional_skills, "additional_skills");
  
   
    if (Array.isArray(formData.availability) && formData.availability.length > 0) {
      formData.availability
        .filter(item => typeof item === "string" && item.trim() !== "")
        .forEach((item, idx) => data.append(`availability[${idx}]`, item));
    }
  
    if (formData.video instanceof File) {
      data.append("video", formData.video);
    }
  
    if (Array.isArray(formData.gallery)) {
      formData.gallery.forEach((img, idx) => {
        if (img instanceof File) {
          data.append(`gallery[${idx}]`, img);
        }
      });
    }
  
    //  для перевірки
    console.log("formData перед збереженням:", formData);
    console.log("Дата, яка буде надіслана:", birth_date);
  
    axios.post("/api/nanny/profile", data)
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
    navigate("/nanny/profile/edit");
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
      <button onClick={() => {
        if (initialData && isChanged()) {
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
                    : formData.photo
                      ? `${baseUrl}/storage/${formData.photo}`
                      : `${baseUrl}/storage/default-avatar.jpg`
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

export default NannyEditPersonalInfo;
