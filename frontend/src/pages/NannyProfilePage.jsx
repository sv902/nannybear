import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import "../styles/profile.css";
import "../styles/register.css";

const NannyProfilePage = () => {
  console.log("🔄 Компонент змонтовано");

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [diplomaPreviewUrl, setDiplomaPreviewUrl] = useState(null);
  const closeModal = () => setDiplomaPreviewUrl(null);

  const toggleEdit = () => setIsEditing(!isEditing);

  const formatList = (arr) => Array.isArray(arr) && arr.length ? arr.join(", ") : "—";

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const translateGender = (gender) => {
    switch (gender) {
      case "female":
        return "Жіноча";
      case "male":
        return "Чоловіча";
      case "other":
        return "Інша";
      default:
        return "Невідомо";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/nanny/profile");  
        setProfile(response.data.profile);
        console.log("🎯 Отримано профіль:", response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = "/registrationlogin";
        } else {
          console.error("Не вдалося отримати профіль:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const [newEducation, setNewEducation] = useState({
    institution: "",
    specialty: "",
    years: "",
    diploma_image: null,
  });
  
  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.specialty && newEducation.years) {
      setProfile({
        ...profile,
        educations: [...profile.educations, newEducation],
      });
      setNewEducation({
        institution: "",
        specialty: "",
        years: "",
        diploma_image: null,
      });
    } else {
      alert("Будь ласка, заповніть всі поля.");
    }
  }; 
      
  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("city", profile.city);
    formData.append("district", profile.district);
    formData.append("phone", profile.phone);
    formData.append("birth_date", profile.birth_date);
    formData.append("gender", profile.gender);
    formData.append("experience_years", profile.experience_years);
    formData.append("hourly_rate", profile.hourly_rate);

    (profile.specialization || []).forEach((item, i) => {
      formData.append(`specialization[${i}]`, item);
    });

    (profile.work_schedule || []).forEach((item, i) => {
      formData.append(`work_schedule[${i}]`, item);
    });

    (profile.languages || []).forEach((item, i) => {
      formData.append(`languages[${i}]`, item);
    });

    (profile.additional_skills || []).forEach((item, i) => {
      formData.append(`additional_skills[${i}]`, item);
    });

    (profile.availability || []).forEach((item, i) => {
      formData.append(`availability[${i}]`, item);
    });
    if (profile.photo instanceof File) {
      formData.append("photo", profile.photo);
    }

    if (profile.video instanceof File) {
      formData.append("video", profile.video);
    }
  
    if (Array.isArray(profile.educations)) {
      profile.educations.forEach((edu, i) => {
        formData.append(`education[${i}][institution]`, edu.institution);
        formData.append(`education[${i}][specialty]`, edu.specialty);
        formData.append(`education[${i}][years]`, edu.years);
        if (edu.diploma_image instanceof File) {
          formData.append(`education[${i}][diploma_image]`, edu.diploma_image);
        } else if (typeof edu.diploma_image === "string") {
          formData.append(`education[${i}][existing_diploma_image]`, edu.diploma_image);
        }
      });
    }

    try {
      const response = await axios.post("/api/nanny/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("👀 Отримані дані:", response.data);
      setProfile(response.data.profile);
      setPreviewPhoto(null);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 422) {
        console.error("⚠️ Валідаційна помилка:", error.response.data.errors);
        alert("Помилка валідації: " + JSON.stringify(error.response.data.errors));
      } else {
        console.error("❌ Помилка збереження профілю:", error);
      }
    }
  };

  if (!profile || typeof profile !== 'object')  {
    return (
      <div className="reg-form-container">
        <p className="description-light">Завантаження профілю няні...</p>
      </div>
    );
  }

  console.log("🧾 Профіль у return:", profile);

  return (
    <>
    {diplomaPreviewUrl && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>✖</button>
          <img src={diplomaPreviewUrl} alt="Диплом" style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        </div>
      </div>
    )} 

    <div className="profile-container">
      <h1 className="title-light">Профіль Няні</h1>
      <div className="description-light">Перевірте та відредагуйте ваші дані нижче:</div>

      <div style={{ marginTop: "20px" }}>
        <strong>Фото профілю:</strong><br />
        {isEditing ? (
          <>
            <input
              type="file"
              accept="image/*"             
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  alert("Файл перевищує 5MB. Завантажте менший файл.");
                  return;
                }
                setPreviewPhoto(URL.createObjectURL(file));
                setProfile({ ...profile, photo: file });
              }}
            />
            {previewPhoto ? (
              <img
                src={previewPhoto}
                alt="Прев’ю фото"
                className="rounded-image"
              />
            ) : (
              typeof profile.photo === "string" && profile.photo && (
                <img
                  src={`${baseUrl}/storage/${profile.photo}`}
                  alt="Фото профілю"
                  style={{ width: "150px", borderRadius: "10px" }}
                />
              )
            )}
          </>
        ) : (
          profile.photo && (
            <img
              src={`${baseUrl}/storage/${profile.photo}`}
              alt="Фото профілю"
              style={{ width: "150px", borderRadius: "10px" }}
            />
          )
        )}
      </div>
      {isEditing ? (
        <input
          type="text"
          value={profile.first_name}
          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
        />
      ) : (
        <p><strong>Ім’я:</strong> {profile.first_name}</p>
      )}

      {isEditing ? (
        <input
          type="text"
          value={profile.last_name}
          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
        />
      ) : (
        <p><strong>Прізвище:</strong> {profile.last_name}</p>
      )}

      {isEditing ? (
        <input
          type="text"
          value={profile.city}
          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
        />
      ) : (
        <p><strong>Місто:</strong> {profile.city}</p>
      )}

      {isEditing ? (
              <input
                type="text"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              />
      ) : (
        <p><strong>Район:</strong> {profile.district}</p>
      )}

      {isEditing ? (
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
      ) : (
        <p><strong>Телефон:</strong> {profile.phone}</p>
      )}

      {isEditing ? (
              <input
                type="text"
                value={profile.birth_date}
                onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
              />
      ) : (
        <p><strong>Дата народження:</strong> {formatDate(profile.birth_date)}</p>
      )}
      
      {isEditing ? (
              <input
                type="text"
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              />
      ) : (
        <p><strong>Стать:</strong> {translateGender(profile.gender)}</p>
      )}
      
      {isEditing ? (
              <input
                type="text"
                value={profile.experience_years}
                onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
              />
      ) : (
        <p><strong>Досвід:</strong> {profile.experience_years} років</p>
      )}
      
      {isEditing ? (
              <input
                type="text"
                value={profile.hourly_rate}
                onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value })}
              />
      ) : (
        <p><strong>Ціна за годину:</strong> {profile.hourly_rate} грн</p>
      )} 

      {isEditing ? (
        <textarea
          value={profile.specialization?.join(", ")}
          onChange={(e) =>
            setProfile({ ...profile, specialization: e.target.value.split(",").map(s => s.trim()) })
          }
        />
      ) : (
        <p><strong>Спеціалізація:</strong> {profile.specialization?.join(", ")}</p>
      )}     
     
     {isEditing ? (
        <textarea
          value={profile.work_schedule?.join(", ")}
          onChange={(e) =>
            setProfile({ ...profile, work_schedule: e.target.value.split(",").map(s => s.trim()) })
          }
        />
      ) : (
        <p><strong>Графік роботи:</strong> {formatList(profile.work_schedule)}</p>
      )}       
      
      <p><strong>Освіта:</strong></p>
      <ul>
      {Array.isArray(profile.educations) && profile.educations.map((edu, idx) => (
        <div key={idx}>
          {isEditing ? (
              <>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...profile.educations];
                    updated[idx].institution = e.target.value;
                    setProfile({ ...profile, educations: updated });
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      alert("Файл перевищує 5MB. Завантажте менший файл.");
                      return;
                    }
                    const updated = [...profile.educations];
                    updated[idx].diploma_image = file;
                    updated[idx].preview = URL.createObjectURL(file);
                    setProfile({ ...profile, educations: updated });
                  }}
                />
                {edu.preview && <img src={edu.preview} alt="Прев’ю" width="150" />}
              </>
            ) : (
              <>
              <li>{edu.institution}, {edu.specialty}, {edu.years}</li>
              {edu.diploma_image && (
                <p>
                  📄 <button
                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                    onClick={() => setDiplomaPreviewUrl(`${baseUrl}/storage/${edu.diploma_image}`)}
                  >
                    Переглянути диплом
                  </button>
                </p>
              )}
            </>
            )}
          </div>
        ))}
      </ul>  
      {isEditing && !profile.educations?.length && (
  <div>
    <h3>Додати освіту</h3>
    <input
      type="text"
      placeholder="Навчальний заклад"
      value={newEducation.institution}
      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
    />
    <input
      type="text"
      placeholder="Спеціальність"
      value={newEducation.specialty}
      onChange={(e) => setNewEducation({ ...newEducation, specialty: e.target.value })}
    />
    <input
      type="text"
      placeholder="Рік закінчення"
      value={newEducation.years}
      onChange={(e) => setNewEducation({ ...newEducation, years: e.target.value })}
    />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setNewEducation({ ...newEducation, diploma_image: e.target.files[0] })}
    />
    <button onClick={handleAddEducation}>Додати освіту</button>
  </div>
)}
   
      {isEditing ? (
        <textarea
          value={profile.languages?.join(", ")}
          onChange={(e) =>
            setProfile({ ...profile, languages: e.target.value.split(",").map(s => s.trim()) })
          }
        />
      ) : (
        <p><strong>Мови:</strong> {profile.languages?.join(", ")}</p>
      )}

      {isEditing ? (
        <textarea
          value={profile.additional_skills?.join(", ")}
          onChange={(e) =>
            setProfile({ ...profile, additional_skills: e.target.value.split(",").map(s => s.trim()) })
          }
        />
      ) : (
        <p><strong>Додаткові навички:</strong> {profile.additional_skills?.join(", ")}</p>
      )}
      
      {isEditing ? (
        <textarea
          value={profile.availability?.join(", ")}
          onChange={(e) =>
            setProfile({ ...profile, availability: e.target.value.split(",").map(s => s.trim()) })
          }
        />
      ) : (
        <p><strong>Доступність:</strong> {profile.availability?.join(", ")}</p>
      )}
      {profile.video && (
      <video width="400" height="300" controls style={{ borderRadius: "10px" }}>
        <source src={`${baseUrl}/storage/${profile.video}`} type="video/mp4" />
        Ваш браузер не підтримує відео.
      </video>
      )}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.size > 20 * 1024 * 1024) {
            alert("Відео перевищує 20MB. Завантажте менше.");
            return;
          }
          setProfile({ ...profile, video: file });
        }}
      />
      
   
      <div style={{ marginTop: "20px" }}>
        {!isEditing ? (
          <button className="option-pill" onClick={toggleEdit}>Редагувати</button>
        ) : (
          <>
            <button className="option-pill" onClick={saveChanges}>Зберегти</button>
            <button className="option-pill" onClick={toggleEdit}>Скасувати</button>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default NannyProfilePage;
