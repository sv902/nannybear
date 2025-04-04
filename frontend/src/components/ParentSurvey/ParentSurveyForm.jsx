import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SurveyStep1 from "./SurveyStep1";
import SurveyStep2 from "./SurveyStep2";
import SurveyStep3 from "./SurveyStep3";
import SurveyStep4 from "./SurveyStep4";
import SurveyStep5 from "./SurveyStep5";
import SurveyStep6 from "./SurveyStep6";
import SurveyStep7 from "./SurveyStep7";
import SurveyStep8 from "./SurveyStep8";
import SurveyStep9 from "./SurveyStep9";
import SurveyStep10 from "./SurveyStep10";
import SurveyStep11 from "./SurveyStep11";
import SurveyStep12 from "./SurveyStep12";
import SurveyStep13 from "./SurveyStep13";
import SurveyStep14 from "./SurveyStep14";
import axios from '../../axiosConfig';

const ParentSurveyForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tryRelogin = async () => {
      try {
        // Отримуємо CSRF cookie
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("password");
  
        if (!email || !password) {
          console.warn("❌ Email або пароль не знайдено в localStorage");
          alert("Ваша сесія завершена. Будь ласка, увійдіть знову.");
          navigate("/registrationlogin");
          return;
        }
  
        const loginRes = await axios.post(
          '/api/login',
          { email, password },
          { withCredentials: true }
        );
  
        const token = loginRes?.data?.token;
        if (token) {
          localStorage.setItem("authToken", token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log("🔑 Автологін успішний:", loginRes.data);
        }
      } catch (error) {
        console.error("❌ Помилка автологіну:", error.response || error.message);
        alert("Не вдалося автоматично увійти. Спробуйте увійти вручну.");
        navigate("/registrationlogin");
      }
    };
  
    tryRelogin();
  }, [navigate]);
  

  useEffect(() => {
    const checkSessionOrLogin = async () => {
      try {
        await axios.get("/api/parent/profile");
        console.log("✅ Сесія активна");
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await axios.get('/sanctum/csrf-cookie');
            const email = localStorage.getItem("email");
            const password = localStorage.getItem("password");
  
            if (!email || !password) {
              navigate("/registrationlogin");
              return;
            }
  
            const loginRes = await axios.post('/api/login', { email, password });
            const token = loginRes?.data?.token;
            if (token) {
              localStorage.setItem("authToken", token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              console.log("🔁 Автологін успішний");
              // повторно перевіримо сесію
              await axios.get("/api/parent/profile");
            }
          } catch (loginErr) {
            console.error("❌ Помилка при автологіні:", loginErr);
            navigate("/registrationlogin");
          }
        }
      }
    };
  
    checkSessionOrLogin();
  }, [navigate]);
  

  const [step, setStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    nannyTypes: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("surveyData");
    if (saved) setSurveyData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const savedStep = localStorage.getItem("surveyStep");
    if (savedStep) setStep(parseInt(savedStep));
  }, []);
  
  useEffect(() => {
    localStorage.setItem("surveyData", JSON.stringify(surveyData));
  }, [surveyData]);

  useEffect(() => {
    localStorage.setItem("surveyStep", step);
    localStorage.setItem("lastVisited", `/registration/parent/survey?step=${step}`);
  }, [step]);
 
  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);
  
  const handleChange = (field, value) => {
    setSurveyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        gender: surveyData.preferred_gender,
        specialization: surveyData.nannyTypes, // 🎯 відповідність
        work_schedule: surveyData.workingHours,
        education: surveyData.nannyEducation,
        languages: surveyData.languages,
        additional_skills: surveyData.additionalSkills,
        experience_years: surveyData.experience_years,
        hourly_rate: surveyData.hourly_rate,
      };
  
      console.log("📦 Надсилаємо на бекенд:", payload);
  
      const res = await axios.post("/api/nanny-preferences", payload, {
        withCredentials: true,
      });
  
      console.log("✅ Параметри збережені:", res.data);
      navigate("/nanny-profiles");
    } catch (error) {
      console.error("❌ Помилка при збереженні:", error.response?.data || error);
      alert("Сталася помилка. Спробуйте пізніше.");
    }
  };
  

  const renderStep = () => {
    switch (step) {
        case 1:
            return <SurveyStep1 
            onNext={next} 
            />;
        case 2:
            return <SurveyStep2
            currentStep={1}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(gender) => {
            setSurveyData(prev => ({ ...prev, preferred_gender: gender }));
            }}
            />;
        case 3:
            return <SurveyStep3 
            currentStep={2}
            totalSteps={8}  
            onNext={next} 
            onBack={back}
            onSelect={(selectedTypes) => {
                setSurveyData(prev => ({
                  ...prev,
                  nannyTypes: selectedTypes
                }));
            }} 
            />;
        case 4:
            return <SurveyStep4
            currentStep={3}
            totalSteps={8}         
            onNext={next} 
            onBack={back} 
            onSelect={(selected) => {
                setSurveyData(prev => ({
                  ...prev,
                  workingHours: selected
                }));
              }}/>;
        case 5:
            return <SurveyStep5
            onNext={next} 
            onBack={back} />;
        case 6:
            return <SurveyStep6 
            currentStep={4}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(educations) => handleChange("nannyEducation", educations)}
            />;
        case 7:
            return <SurveyStep7 
            onNext={next} 
            onBack={back} />;
        case 8:
            return <SurveyStep8 
            currentStep={5}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(languages) => handleChange("languages", languages)}
            />;    
        case 9:
            return <SurveyStep9 
            onNext={next} 
            onBack={back} />;    
        case 10:
            return <SurveyStep10 
            currentStep={6}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(skills) =>
              setSurveyData((prev) => ({ ...prev, additionalSkills: skills }))
            }
            />;
        case 11:
            return <SurveyStep11 
            onNext={next} 
            onBack={back} />;
        case 12:
            return <SurveyStep12 
            currentStep={7}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(exp) => handleChange("experience_years", exp)}
            />;
        case 13:
            return <SurveyStep13 
            currentStep={8}
            totalSteps={8} 
            onNext={next} 
            onBack={back} 
            onSelect={(rate) => handleChange("hourly_rate", rate)}
            />;   
        case 14:
            return <SurveyStep14 
            onSubmit={handleSubmit} 
            onBack={back}
            surveyData={surveyData}             
            />;
      default:
        return null;
    }
  };

  return <div className="servey-form-container">{renderStep()}</div>;
};

export default ParentSurveyForm;
