// ParentProfileForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import axios from '../../axiosConfig';



const ParentProfileForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    children: [],
  });
  const navigate = useNavigate();

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);  

  const handleSubmit = async () => {
    try {
      // 1. CSRF cookie
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  
      // 2. Email & password from localStorage
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
  
      if (!email || !password) {
        alert("Не вдалося знайти email або пароль у localStorage");
        return;
      }
  
      // 3. Login
      const loginRes = await axios.post('/api/login', { email, password }, { withCredentials: true });
      const token = loginRes.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      console.log("✅ Успішний логін:", loginRes.data);
  
      // 4. Формуємо дату народження
      const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`;
      const payload = {
        ...formData,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: birthDate,
        phone: formData.phone,
        city: formData.city,
        district: formData.district,
        address: formData.address,   
        floor: formData.floor,
        apartment: formData.apartment,
        children: formData.children || [],
      };
  
      delete payload.birthDay;
      delete payload.birthMonth;
      delete payload.birthYear;
      delete payload.firstName;
      delete payload.lastName;
      delete payload.address;
  
      console.log("📦 Payload для збереження:", payload);
  
      // 5. Створюємо профіль, якщо ще не існує
      //await axios.post('/api/profile/create', {}, { withCredentials: true });
  
      // 6. Зберігаємо повні дані профілю
      const response = await axios.post('/api/parent/profile', payload, { withCredentials: true });
  
      console.log("🎉 Профіль збережено:", response.data);
  
      if (response.status === 200) {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        navigate("/registration/parent/survey");
      }
    } catch (error) {
      console.error("❌ Помилка збереження профілю:", error.response?.data || error.message);
      alert("Сталася помилка при збереженні. Спробуйте ще раз.");
    }
  };
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            formData={formData}
            setFormData={setFormData}
            onNext={next}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            onBack={back}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-form-wrapper">
      {renderStep()}  
    </div>
  );
};

export default ParentProfileForm;
