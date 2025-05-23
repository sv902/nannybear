import React, { useEffect, useState, useCallback, useMemo  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import NannyCard from "../components/NannyCard/NannyCard";
import "../styles/nannylistpage.css";
import flash from "../assets/icons/flash.svg";
import heart from "../assets/icons/heart.svg";
import whiteFlash from "../assets/icons/white-flash.svg";  
import whiteHeart from "../assets/icons/white-heart.svg";
import VariantHeader from "../components/Header/VariantHeader";
import { useFavorites } from "../context/FavoritesContext";
import Footer from "../components/Footer/Footer"; 
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const NannyListPage = () => {
  const navigate = useNavigate();

  const [nannies, setNannies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Найкращі співпадіння");  // Стан для вибору сортування
  const [isUrgentClicked, setIsUrgentClicked] = useState(false);  // Стейт для кнопки термінового виклику
  const [isFavoriteClicked, setIsFavoriteClicked] = useState(false);  // Стейт для кнопки улюблених

  const { favoriteIds, toggleFavorite } = useFavorites();  

  // Функція для скидання фільтрів та сортування
  const resetFilters = useCallback(async () => {
    console.log("resetFilters викликано");    
    setPreferences(null);
    setSelectedSort("Найкращі співпадіння");
    setIsFavoriteClicked(false);
    setIsUrgentClicked(false);
    setCurrentPage(1);
    try {
      const res = await axios.get("/api/nanny-profiles");
      setNannies(res.data || []);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error("Error fetching all nannies:", err);
    }
  }, []);  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Стан для відображення випадаючого меню

  // Функція для зміни вибору сортування
  const handleSortChange = (newSort) => {
    setSelectedSort(newSort);
    setIsDropdownOpen(false);  // Закриваємо меню після вибору
  };
  
  const handleUrgentClick = () => {
    setIsUrgentClicked(!isUrgentClicked);  // Перемикаємо стан
  };

  const handleFavoriteClick = () => {
    setIsFavoriteClicked(!isFavoriteClicked); // Перемикаємо стан кнопки
    console.log("Стан 'Улюблені' після натискання: ", !isFavoriteClicked); // Для перевірки
  };  
  console.log("Список улюблених: ", favoriteIds);
  console.log("Няні до фільтрації: ", nannies);
  const filteredSortedNannies = useMemo(() => {
    let filtered = nannies; 
  
    // Фільтрація по кнопках
    if (isFavoriteClicked) {
      // Фільтруємо по nanny_id
      filtered = filtered.filter((nanny) => 
        favoriteIds.some((fav) => fav.nanny_id === nanny.id) // Перевіряємо чи nanny.id є в списку улюблених
      );
    }
  
    if (isUrgentClicked) {
      filtered = filtered.filter((nanny) => nanny.availability && nanny.availability.includes("вільна")); // Виводимо тільки вільних нянь
    }
  
    // Сортування за обраним критерієм
    switch (selectedSort) {
      case "За ціною (від мін. до макс.)":
        filtered = [...filtered].sort((a, b) => a.hourly_rate - b.hourly_rate);
        break;
      case "За ціною (від макс. до мін.)":
        filtered = [...filtered].sort((a, b) => b.hourly_rate - a.hourly_rate);
        break;
      case "За стажем":
        filtered = [...filtered].sort((a, b) => b.experience_years - a.experience_years);
        break;
      case "За відгуками":
          filtered = [...filtered].sort((a, b) => {
            const ratingA = a.reviews_avg_rating ?? 0;
            const ratingB = b.reviews_avg_rating ?? 0;
            return ratingB - ratingA;
          });
          break; 
      default:
        break;
    }
  
    return filtered; // Повертаємо відфільтровані та відсортовані дані
  }, [nannies, isFavoriteClicked, isUrgentClicked, favoriteIds, selectedSort]);  // Використовуємо контекст для улюблених
  
  const setAuthToken = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    if (csrfToken) {
      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;  // Додаємо CSRF токен
    }
  }, []);

  useEffect(() => {
    setAuthToken(); 
  }, [setAuthToken]);

  useEffect(() => {
    const fetchNannies = async () => {
      try {
        const response = await axios.get(`/api/nanny-profiles?page=${currentPage}`);
        console.log("Response from API: ", response.data);
        setNannies(response.data.data || []); // Завантажуємо дані про всіх нянь
        setTotalPages(response.data.last_page); // Оновлюємо кількість сторінок
        setLoading(false); 
        console.log("Няні після отримання з API: ", response.data.data);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
        setLoading(false); 
      }
    };   

    fetchNannies();
  }, [currentPage]);   

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;  // Перевірка на допустимість сторінки
    setCurrentPage(page);
  };  
  
  const itemsPerPage = 15; // Встановлюємо кількість карток на сторінці

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
 
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setAuthToken(); 
        const res = await axios.get("/api/nanny-preferences", {
          withCredentials: true,
        });
        console.log('API Response filtr:', res.data); 
        const filters = res.data.preferences;
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
          setPreferences(mapped);
        } else {
          const all = await axios.get("/api/nanny-profiles");
          console.log('API Response after filter:', all.data); 
          setNannies(all.data);
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
      }
    };

    fetchPreferences();
  }, [setAuthToken]);

  useEffect(() => {
    const fetchFilteredNannies = async () => {
      if (!preferences) return;
      try {
        setAuthToken();
        const res = await axios.post("/api/nanny-profiles/filter", preferences, {
          withCredentials: true,
        });
        console.log('API Response filter2:', res.data);
        setNannies(res.data.data);
        setTotalPages(res.data.last_page);  // Оновлюємо кількість сторінок після фільтрації
      } catch (err) {
        console.error("Error filtering nannies:", err);
      }
    };
  
    fetchFilteredNannies();
  }, [preferences, setAuthToken]);
  
  const handleGoToSurvey = () => {
    navigate("/registration/parent/survey?from=nanny-list");
  };
 

  if (loading) {
    return <LoadingScreen text="Завантаження сторінки..." />;
  }

  return (
    <div>
       <VariantHeader
          resetFilters={resetFilters}
          setNannies={setNannies}
          setPreferences={setPreferences}
          setCurrentPage={setCurrentPage}
          setTotalPages={setTotalPages}
        />
    <div className="profile-list-container">
       
      <div className="line-text-title-block">
        <h1 className="title-nanny">Усі няні</h1>
        <div className="pagination-info">
          <p>Сторінка {currentPage} з {totalPages}</p>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination top-right">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          | &lt;&lt;
        </button>

        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={`pagination-page ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          &gt;&gt; |
        </button>
      </div>

      {/* Buttons */}
      <div className="btn-container-nanny">
        <button onClick={handleGoToSurvey} className="go-to-survey-button">
          Налаштувати фільтр
        </button>

        {/* Кнопка Терміновий виклик */}
        <button className="go-to-not-busy-btn-flash" onClick={handleUrgentClick}>
          <img src={flash} alt="icon" className="icon-dark" />
          <img src={whiteFlash} alt="icon" className="icon-light" />
          Терміновий виклик
        </button>

        {/* Кнопка Улюблені */}
        <button className="go-to-favorit-button" onClick={handleFavoriteClick}>
          <img src={heart} alt="icon" className="icon-dark" />
          <img src={whiteHeart} alt="icon" className="icon-light" />
          Улюблені
        </button>

      <div className="sort-nanny">
      <p className="sort-nanny-text">Сортувати:</p>

      {/* Інпут для сортування */}
      <div className="sort-dropdown">
        <input 
          type="text" 
          value={selectedSort} 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Відкриття/закриття меню
          readOnly
          className="sort-input"
        />
        {/* Галочка вниз */}
        <span className={`arrow-down ${isDropdownOpen ? "rotate" : ""}`}>&or;</span>

        {/* Випадаюче меню */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => handleSortChange("Найкращі співпадіння")}>
              Найкращі співпадіння
            </div>
            <div className="dropdown-item" onClick={() => handleSortChange("За ціною (від мін. до макс.)")}>
              За ціною (від мін. до макс.)
            </div>
            <div className="dropdown-item" onClick={() => handleSortChange("За ціною (від макс. до мін.)")}>
              За ціною (від макс. до мін.)
            </div>
            <div className="dropdown-item" onClick={() => handleSortChange("За стажем")}>
              За стажем
            </div>
            <div className="dropdown-item" onClick={() => handleSortChange("За відгуками")}>
              За відгуками
            </div>
          </div>
          )}
      </div>

      {/* Виведення інформації за вибраним фільтром */}
      <div className="sort-info">
        {selectedSort === "Найкращі співпадіння"}
        {selectedSort === "За ціною (від мін. до макс.)"}
        {selectedSort === "За ціною (від макс. до мін.)"}
        {selectedSort === "За стажем"}
        {selectedSort === "За відгуками"}
      </div>
    </div>
      </div>
    
      {/* Nanny Cards */}
      <div className="nanny-cards-container">
        {Array.isArray(filteredSortedNannies) && filteredSortedNannies.length > 0 ? (
          filteredSortedNannies.slice(indexOfFirst, indexOfLast).map((nanny) => (
            <NannyCard
              key={nanny.id}
              nanny={nanny}
              onToggleFavorite={toggleFavorite}
              isFavorite={favoriteIds.includes(nanny.id)}
              onClick={() => navigate(`/nanny-profile/${nanny.id}`)}
            />
          ))
        ) : (
          <p className="description-dark">Нянь не знайдено</p>
        )}
      </div>


      {/* Pagination */}
      {currentPage < totalPages && (
          <button className="next-page-btn" onClick={() => setCurrentPage((prev) => prev + 1)}>
            НАСТУПНА СТОРІНКА
          </button>
        )}
      <div className="pagination bottom-center">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          | &lt;&lt;
        </button>

        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={`pagination-page ${currentPage === pageNumber ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          &gt;&gt; |
        </button>       
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default NannyListPage;
