import React, { useState, useEffect  } from "react";
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
import Header from "../../components/Header/Header";


const NannyProfileForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await axios.get("/api/nanny/profile", { withCredentials: true });
        // setProfile(res.data.profile); ← якщо потрібно
        console.log("🎯 Сесія активна. Профіль існує.");
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.setItem("lastVisited", window.location.pathname);
          navigate("/registrationlogin");
        } else {
          console.error("❌ Помилка при перевірці сесії:", error);
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("nannyFormData");
      localStorage.removeItem("justLoggedIn");
      setFormData({ availability: "вільна" });
    }
  }, []); 
  
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    district: "",
    gender: "",
    experience_years: "",
    hourly_rate: "",
    availability: [],
    specialization: [],  // Specializations will be stored here
    work_schedule: [],
    languages: [],
    additional_skills: [],
    education: [],
  });

  const [step, setStep] = useState(1);
  // const [formData, setFormData] = useState(() => {
  //   const saved = localStorage.getItem("nannyFormData");
  //   return saved ? JSON.parse(saved) : { availability: "вільна" };
  // });

  useEffect(() => {
    const saved = localStorage.getItem("nannyFormData");
    const savedStep = localStorage.getItem("nannyFormStep");
    if (saved && savedStep) {
      setFormData(JSON.parse(saved));
      setStep(parseInt(savedStep));
    }
  }, []);  
  
  useEffect(() => {
    localStorage.setItem("nannyFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("nannyFormStep", step);
    localStorage.setItem("lastVisited", `/registration/nanny/profile?step=${step}`);
  }, [step]); 
  
  useEffect(() => {
    const timestamp = localStorage.getItem("nannyFormSavedAt");
    if (timestamp && Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("nannyFormData");
      localStorage.removeItem("nannyFormStep");
    }
    localStorage.setItem("nannyFormSavedAt", Date.now().toString());
  }, []); 

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      // 1. CSRF cookie
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  
      const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`;
      
      const formDataToSend = new FormData();
      
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("birth_date", birthDate);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("experience_years", formData.experience_years);
      formDataToSend.append("hourly_rate", formData.hourly_rate);

      if (Array.isArray(formData.availability)) {
        formData.availability.forEach((val, idx) =>
          formDataToSend.append(`availability[${idx}]`, val)
        );
      } else {
        formDataToSend.append("availability[0]", formData.availability);
      } 

      formData.specialization.forEach((item, i) =>
        formDataToSend.append(`specialization[${i}]`, item)
      );
      formData.work_schedule.forEach((item, i) =>
        formDataToSend.append(`work_schedule[${i}]`, item)
      );
      formData.languages.forEach((item, i) =>
        formDataToSend.append(`languages[${i}]`, item)
      );
      formData.additional_skills.forEach((item, i) =>
        formDataToSend.append(`additional_skills[${i}]`, item)
      );
      
      // 🎓 Освіта
      (formData.education || []).forEach((edu, i) => {
        formDataToSend.append(`education[${i}][institution]`, edu.institution);
        formDataToSend.append(`education[${i}][specialty]`, edu.specialty);
        formDataToSend.append(`education[${i}][years]`, `${edu.startYear}–${edu.endYear}`);

        if (edu.diploma_image) {
          formDataToSend.append(`education[${i}][diploma_image]`, edu.diploma_image);
        }
      });
        
      //  Зберігаємо повні дані профілю
        const response = await axios.post("/api/nanny/profile", formDataToSend, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
      console.log("🎉 Профіль збережено:", response.data);
  
      if (response.status === 200) {        
        localStorage.removeItem("nannyFormData");
        navigate(`/nanny/profile/${response.data.id}`);
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
            onSelect={(educationData) =>
              setFormData((prev) => ({ ...prev, education: educationData }))
            }
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
      <Header />  
      {renderStep()}  
    </div>
  );
};

export default NannyProfileForm;
