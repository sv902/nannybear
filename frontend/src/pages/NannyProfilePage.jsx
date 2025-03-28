import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import "../styles/profile.css";
import "../styles/register.css";

const NannyProfilePage = () => {
  const [profile, setProfile] = useState(null);

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
        const response = await axios.get('/api/nanny/profile');
        setProfile(response.data);
        console.log("Токен з localStorage:", localStorage.getItem("authToken"));
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

  if (!profile) return <div className="reg-form-container">
    <p className="description-light">Завантаження профілю няні...</p>
    </div>


  return (
    <div className="profile-container">
      <h1 className="title-light">Профіль Няні</h1>
      <p><strong>Ім’я:</strong> {profile.first_name}</p>
      <p><strong>Прізвище:</strong> {profile.last_name}</p>
      <p><strong>Місто:</strong> {profile.city}</p>
      <p><strong>Район:</strong> {profile.district}</p>
      <p><strong>Телефон:</strong> {profile.phone}</p>
      <p><strong>Дата народження:</strong> {formatDate(profile.birth_date)}</p>
      <p><strong>Стать:</strong> {translateGender(profile.gender)}</p>
      <p><strong>Досвід:</strong> {profile.experience_years} років</p>
      <p><strong>Ціна за годину:</strong> {profile.hourly_rate} грн</p>

      <p><strong>Спеціалізація:</strong> {profile.specialization?.join(", ")}</p>
      <p><strong>Графік роботи:</strong> {profile.work_schedule?.join(", ")}</p>
      <p><strong>Освіта:</strong></p>
          <ul>
            {Array.isArray(profile.education) &&
              profile.education.map((edu, idx) => (
                <li key={idx}>
                  {typeof edu === "string"
                    ? edu
                    : `${edu.institution}, ${edu.specialty}, ${edu.years}`}
                </li>
              ))}
          </ul>
      <p><strong>Мови:</strong> {profile.languages?.join(", ")}</p>
      <p><strong>Додаткові навички:</strong> {profile.additional_skills?.join(", ")}</p>
      <p><strong>Доступність:</strong> {profile.availability?.join(", ")}</p>

      {profile.photo && (
        <div>
          <strong>Фото:</strong><br />
          <img src={profile.photo} alt="Фото профілю" style={{ width: "150px", borderRadius: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default NannyProfilePage;
