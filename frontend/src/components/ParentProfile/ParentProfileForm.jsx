import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import axios from '../../axiosConfig';
import Header from "../../components/Header/Header";

const ParentProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialStep = parseInt(query.get("step")) || 1;

  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("parentFormData");
    return saved ? JSON.parse(saved) : { children: [] };
  });

  useEffect(() => {
    const checkSessionOrLogin = async () => {
      try {
        await axios.get("/api/parent/profile", { withCredentials: true });
        console.log("✅ Сесія активна");
      } catch (error) {
        if (error.response?.status === 401) {
          const email = localStorage.getItem("email");
          const password = localStorage.getItem("password");

          if (!email || !password) {
            localStorage.setItem("lastVisited", window.location.pathname);
            navigate("/registrationlogin");
            return;
          }

          try {
            await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
            const loginRes = await axios.post(
              "/api/login",
              { email, password },
              { withCredentials: true }
            );
            console.log("🔁 Автологін:", loginRes.data);
          } catch (loginError) {
            console.error("❌ Помилка автологіну", loginError);
            navigate("/registrationlogin");
          }
        }
      }
    };

    checkSessionOrLogin();
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("parentFormData");
      localStorage.removeItem("justLoggedIn");
      setFormData({ children: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("parentFormData", JSON.stringify(formData));
  }, [formData]);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`;
      const payload = {
        ...formData,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: birthDate,
        phone: formData.phone,
        addresses: [
          {
            type: formData.addresses?.[0]?.type || "Дім",
            city: formData.addresses?.[0]?.city || "",
            district: formData.addresses?.[0]?.district || "",
            address: formData.addresses?.[0]?.address || "",
            floor: formData.addresses?.[0]?.floor || "",
            apartment: formData.addresses?.[0]?.apartment || "",
          }
        ],
        children: (formData.children || []).map(child => ({
          name: child.name,
          birth_date: `${child.year}-${String(child.month).padStart(2, "0")}-${String(child.day).padStart(2, "0")}`,
        })),
      };      

      delete payload.birthDay;
      delete payload.birthMonth;
      delete payload.birthYear;
      delete payload.firstName;
      delete payload.lastName;  

      const response = await axios.post('/api/parent/profile', payload, { withCredentials: true });

      console.log("🎉 Профіль збережено:", response.data);

      if (response.status === 200) {
        localStorage.removeItem("parentFormData");
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
        return <Step1 formData={formData} setFormData={setFormData} onNext={next} />;
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} onNext={next} onBack={back} />;
      case 3:
        return <Step3 formData={formData} setFormData={setFormData} onBack={back} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return <div className="profile-form-wrapper">
    <Header />
    {renderStep()}</div>;
};

export default ParentProfileForm;
