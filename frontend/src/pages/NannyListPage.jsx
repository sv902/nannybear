import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/nannylistpage.css"

const NannyListPage = () => { 
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const [preferences, setPreferences] = useState(null);
  const [nannies, setNannies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNannies = nannies.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(nannies.length / itemsPerPage);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteNannies");
    return saved ? JSON.parse(saved) : [];
  });
  
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("favoriteNannies", JSON.stringify(updated));
      return updated;
    });
  };  

  // useEffect(() => {
  //   axios.get("/api/nanny-profiles", { withCredentials: true })
  //     .then((res) => setNannies(res.data))
  //     .catch((err) => console.error("Помилка при завантаженні нянь:", err));
  // }, []);

  // useEffect(() => {
  //   const fetchPreferences = async () => {
  //     try {
  //       const res = await axios.get("/api/nanny-preferences", {
  //         withCredentials: true,
  //       });     
  
  //       // Отримаємо лише об'єкт фільтрів
  //       setPreferences(res.data.preferences || {});
  //     } catch (err) {
  //       console.error("❌ Не вдалося завантажити критерії:", err);
  //     }
  //   };
  
  //   fetchPreferences();
  // }, []);

    useEffect(() => {
      const fetchPreferences = async () => {
        try {
          const res = await axios.get("/api/nanny-preferences", {
            withCredentials: true,
          });
          const filters = res.data.preferences;
          console.log("🟡 Отримано з сервера:", res.data);

          if (filters && Object.keys(filters).length > 0) {
            const mapped = {
              gender: filters.gender,
              experience_years: filters.experience_years,
              hourly_rate: filters.hourly_rate,
              languages: filters.languages?.split(",").map((l) => l.trim()),
              education: filters.education?.split(",").map((e) => e.trim()),
              work_schedule: filters.work_schedule?.split(",").map((w) => w.trim()),
              specialization: filters.specialization?.split(",").map((s) => s.trim()),
              additional_skills: filters.additional_skills?.split(",").map((a) => a.trim()),
            };            

          console.log("🔎 Передано у фільтр:", mapped);
          setPreferences(mapped);
        } else {
          const all = await axios.get("/api/nanny-profiles");
          setNannies(all.data);
        }
        } catch (err) {
          console.error("❌ Не вдалося завантажити критерії:", err);
        }
      };
    
      fetchPreferences();
    }, []); 
  

  useEffect(() => {
    const fetchNannies = async () => {
      if (!preferences) return; // чекаємо, поки завантажаться
  
      try {
        console.log("🎯 Надсилається на фільтрацію:", preferences);
        const res = await axios.post("/api/nanny-profiles/filter", preferences, {
          withCredentials: true,
        });
        setNannies(res.data); // отримаємо список, що підходить
      } catch (err) {
        console.error("❌ Помилка фільтрації нянь:", err);
      }
    };
  
    fetchNannies();
  }, [preferences]);
  
  useEffect(() => {
    if (preferences) {
      console.log("🎯 Застосовані фільтри:", preferences);
    }
  }, [preferences]);  

  const handleGoToSurvey = () => {
    navigate("/registration/parent/survey?from=nanny-list");
  };

  return (
    <div className="profile-list-container">
      <h1 className="title-dark">Усі няні</h1>

      {preferences && (
      <button
        className="clear-filter-button"
        onClick={async () => {
          setPreferences(null);
          try {
            const res = await axios.get("/api/nanny-profiles");
            setNannies(res.data);
          } catch (err) {
            console.error("❌ Помилка при завантаженні всіх нянь", err);
          }
        }}
      >
        Показати всіх нянь
      </button>
    )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button onClick={handleGoToSurvey} className="go-to-survey-button">
        Налаштувати фільтр
      </button>
      <h2>{nannies.length} нянь знайдено</h2>

      {preferences && (
        <div className="active-filters">
          <h3>Застосовані фільтри:</h3>
          <ul>
            {Object.entries(preferences).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              const displayValue = Array.isArray(value) ? value.join(", ") : value;
              return <li key={key}><strong>{key}:</strong> {displayValue}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="nanny-cards-container">
        {currentNannies.map((nanny) => (
          <div key={nanny.id} className="nanny-card">
            {nanny.photo && (
              <img
                src={`${baseUrl}/storage/${nanny.photo}`}
                alt={`${nanny.first_name} ${nanny.last_name}`}
                className="nanny-photo"
              />
            )}
            <h2>{nanny.first_name} {nanny.last_name}</h2>
            <button className="favorite-btn" onClick={() => toggleFavorite(nanny.id)}>
              {favorites.includes(nanny.id) ? "❤️" : "🤍"}
            </button>

            <p><strong>Місто:</strong> {nanny.city}, {nanny.district}</p>
            <p><strong>Телефон:</strong> {nanny.phone}</p>
            <p><strong>Дата народження:</strong> {
              new Date(nanny.birth_date).toLocaleDateString("uk-UA")
            }</p>
            <p><strong>Стать:</strong> {nanny.gender}</p>

            <p><strong>Спеціалізація:</strong> {nanny.specialization?.join(", ")}</p>
            <p><strong>Графік роботи:</strong> {nanny.work_schedule?.join(", ")}</p>
            <p><strong>Освіта:</strong></p>
              {Array.isArray(nanny.education)
                ? nanny.education.map((edu, idx) => (
                    <div key={idx}>
                      {edu.institution} ({edu.specialty}, {edu.years})
                    </div>
                  ))
                : <p>—</p>}
            <p><strong>Мови:</strong> {nanny.languages?.join(", ")}</p>
            <p><strong>Додаткові навички:</strong> {nanny.additional_skills?.join(", ")}</p>
            <p><strong>Стаж:</strong> {nanny.experience_years} років</p>
            <p><strong>Ціна за годину:</strong> {nanny.hourly_rate} грн</p>
            <p><strong>Доступність:</strong> {nanny.availability?.join(", ")}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NannyListPage;
