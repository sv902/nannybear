import React, { useState, useEffect, useRef } from "react";
import axios from "../../axiosConfig";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import UnsavedChangesModal from "../Modal/UnsavedChangesModal";
import SavedChangesModal from "../Modal/SavedChangesModal";
import cameraIcon from "../../assets/icons/camera.svg";
import fotoIcon from "../../assets/icons/Foto.svg";
import "../../styles/settings.css";

const MAX_EDUCATIONS = 10;

const NannyEditEducationPage = () => {  
  const [educations, setEducations] = useState([]);
  const [noEducation, setNoEducation] = useState(false);
  const [initialEducations, setInitialEducations] = useState([]);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const fileInputsRef = useRef([]);

  useEffect(() => {
    axios.get("/api/nanny/profile").then((res) => {
      console.log("Освіта з профілю:", res.data.profile.educations);
      const fromDB = Array.isArray(res.data.profile.educations) ? res.data.profile.educations : [];

      const formatted = fromDB.map((edu) => ({
        institution: edu.institution || "",
        specialty: edu.specialty || "",
        startYear: edu.years?.split("-")[0] || "",
        endYear: edu.years?.split("-")[1] || "",
        diploma_image: edu.diploma_image ?? "",
        preview: null,
      }));
      setEducations(formatted);
      setInitialEducations(formatted);
    });
  }, []);

    useEffect(() => {
      return () => {
        educations.forEach((edu) => {
          if (edu.preview) {
            URL.revokeObjectURL(edu.preview);
          }
        });
      };
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isChanged = () => {
      return educations.some((edu, index) => {
        const initial = initialEducations[index] || {};
        return (
          edu.institution !== initial.institution ||
          edu.specialty !== initial.specialty ||
          edu.startYear !== initial.startYear ||
          edu.endYear !== initial.endYear ||
          (edu.diploma_image instanceof File) // файл було змінено
        );
      });
    };


  const handleInputChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...educations];
    if (files && files[0]) {
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated[index].diploma_image = files[0];
      updated[index].preview = URL.createObjectURL(files[0]);
    } else {
      updated[index][name] = value;
    }
    setEducations(updated);
  };

  const triggerFileInput = (index) => {
    if (fileInputsRef.current[index]) {
      fileInputsRef.current[index].click();
    }
  };

  const addEducation = () => {
    if (educations.length >= MAX_EDUCATIONS) return;
    setNoEducation(false);
    setEducations([
      ...educations,
      {
        institution: "",
        specialty: "",
        startYear: "",
        endYear: "",
        diploma_image: null,
        preview: null,
      },
    ]);
  };

  const deleteEducation = (index) => {
    const updated = [...educations];
    updated.splice(index, 1);
    setEducations(updated);
  };

  const handleSave = () => {
    const formData = new FormData();
      educations.forEach((edu, index) => {
      formData.append(`education[${index}][institution]`, edu.institution);
      formData.append(`education[${index}][specialty]`, edu.specialty);
      formData.append(`education[${index}][years]`, `${edu.startYear}-${edu.endYear}`);
      if (edu.diploma_image instanceof File) {
        formData.append(`education[${index}][diploma_image]`, edu.diploma_image);
      }
    });
    
    axios.post("/api/nanny/profile", formData)
      .then(() => {
        setInitialEducations(
          educations.map((edu) => ({
            ...edu,
            diploma_image:
              typeof edu.diploma_image === "string"
                ? edu.diploma_image
                : null, // файл уже завантажений, не зберігаємо в initial
            preview: null,
          }))
        );
        setShowSavedModal(true);
      })
      .catch(() => alert("Помилка збереження освіти"));
  };

  return (
    <div>
      <VariantHeaderNanny />
      <div className="edit-page-container">
        <button
          onClick={() => (isChanged() ? setShowUnsavedModal(true) : window.history.back())}
          className="back-button-dark"
        >
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="settings-title-pag">Освіта</h1>
        <div className="education-selection">
          {!noEducation && educations.map((edu, index) => (
            <div key={index} className="education-block-nanny">
              <div className="education-header-nanny">
                <strong className="education-title-nanny">Освіта {index + 1}</strong>
                <button className="remove-education-btn-nanny" onClick={() => deleteEducation(index)}>✖</button>
              </div>

              <input
                className="education-input-nanny"
                type="text"
                name="institution"
                placeholder="Назва навчального закладу..."
                value={edu.institution}
                onChange={(e) => handleInputChange(index, e)}
              />
              <input
                className="education-input-nanny"
                type="text"
                name="specialty"
                placeholder="Напрям..."
                value={edu.specialty}
                onChange={(e) => handleInputChange(index, e)}
              />
              <div className="years-row">
                <input
                  className="education-input-nanny half-width"
                  type="text"
                  name="startYear"
                  placeholder="Рік початку"
                  value={edu.startYear}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <input
                  className="education-input-nanny half-width"
                  type="text"
                  name="endYear"
                  placeholder="Рік завершення"
                  value={edu.endYear}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <input
                type="file"
                name="diploma_image"
                accept="image/*"
                ref={(el) => fileInputsRef.current[index] = el}
                style={{ display: "none" }}
                onChange={(e) => handleInputChange(index, e)}
              />

              {!edu.preview && !edu.diploma_image && (
                <button
                  type="button"
                  className="custom-file-upload-nanny"
                  onClick={() => triggerFileInput(index)}
                >
                  <img src={cameraIcon} alt="Іконка камери" className="center-icon" /> Додати фото диплому
                </button>
              )}

            {(edu.preview || (!!edu.diploma_image && typeof edu.diploma_image === "string")) && (
              <a
                className="custom-file-upload-nanny"
                href={edu.preview || edu.diploma_image}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={fotoIcon} alt="Іконка фото" className="center-icon" /> Фото документа
              </a>
            )}

            </div>
          ))}

          {!noEducation && educations.length < MAX_EDUCATIONS && (
            <button className="option-pill add-education-btn" onClick={addEducation}>
              Додати освіту
            </button>
          )}
        </div>

        <div className="save-btn-cont">
          <button className="save-btn" onClick={handleSave}>ЗБЕРЕГТИ ЗМІНИ</button>
        </div>

        {showUnsavedModal && <UnsavedChangesModal onClose={() => setShowUnsavedModal(false)} onExit={() => window.history.back()} />}
        {showSavedModal && <SavedChangesModal onClose={() => setShowSavedModal(false)} />}
      </div>
      <Footer />
    </div>
  );
};

export default NannyEditEducationPage;