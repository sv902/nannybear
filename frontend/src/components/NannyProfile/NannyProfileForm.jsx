import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Step10 from "./Step10";
import Step11 from "./Step11";
import axios from '../../axiosConfig';


const NannyProfileForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    availability: "вільна",
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
        gender: formData.gender,
        specialization: formData.specialization,
        work_schedule: formData.work_schedule,
        education: formData.education,
        languages: formData.languages,
        additional_skills: formData.additional_skills,
        experience_years: formData.experience_years,
        hourly_rate: formData.hourly_rate,    
        availability: Array.isArray(formData.availability) 
          ? formData.availability 
          : [formData.availability],
      };
        
      delete payload.birthDay;
      delete payload.birthMonth;
      delete payload.birthYear;
      delete payload.firstName;
      delete payload.lastName; 
  
      console.log("📦 Payload для збереження:", payload);
  
      // 5. Створюємо профіль, якщо ще не існує
      //await axios.post('/api/profile/create', {}, { withCredentials: true });
  
      // 6. Зберігаємо повні дані профілю
      const response = await axios.post('/api/nanny/profile', payload, { withCredentials: true });
  
      console.log("🎉 Профіль збережено:", response.data);
  
      if (response.status === 200) {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        navigate("/registration/nanny/profile");
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
            onNext={next}
            onBack={back}
            onSelect={(gender) => setFormData({ ...formData, gender })}
          />
        );
        case 4:
        return (
          <Step4
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(value) => setFormData({ ...formData, specialization: value })}
          />
        );
        case 5:
        return (
          <Step5
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(work_schedule) => setFormData({ ...formData, work_schedule })}
          />
        );
        case 6:
        return (
          <Step6
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(educationData) => {
              setFormData(prev => ({ ...prev, education: educationData }));
            }}
          />
        );
        case 7:
        return (
          <Step7
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(languages) => setFormData({ ...formData, languages })}
          />
        );
        case 8:
        return (
          <Step8
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(additional_skills) => setFormData({ ...formData, additional_skills })}
          />
        );
        case 9:
        return (
          <Step9
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(value) => setFormData({ ...formData, experience_years: value })}
          />
        );
        case 10:
        return (
          <Step10
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            onSelect={(value) => setFormData({ ...formData, hourly_rate: value })}
          />
        );
        case 11:
        return (
          <Step11
            formData={formData}
            setFormData={setFormData}
            onBack={back}
            onSubmit={handleSubmit}
            onSelect={(district) => setFormData({ ...formData, district })}
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

export default NannyProfileForm;
