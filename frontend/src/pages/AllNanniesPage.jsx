import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeader from "../components/Header/VariantHeader";
import NannyCard from "../components/NannyCard/NannyCard";
import Footer from "../components/Footer/Footer";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/nannylistpage.css";
import flash from "../assets/icons/flash.svg";
import heart from "../assets/icons/heart.svg";
import whiteFlash from "../assets/icons/white-flash.svg";  
import whiteHeart from "../assets/icons/white-heart.svg";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const AllNanniesPage = () => {
    const navigate = useNavigate();

    const [nannies, setNannies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [selectedSort, setSelectedSort] = useState("Найкращі співпадіння");  // Стан для вибору сортування
    const [isUrgentClicked, setIsUrgentClicked] = useState(false);  // Стейт для кнопки термінового виклику
    const [isFavoriteClicked, setIsFavoriteClicked] = useState(false);  // Стейт для кнопки улюблених
  
    const { favoriteIds, toggleFavorite } = useFavorites(); 
    
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
    const fetchAllNannies = useCallback(async () => {
        try {
          const response = await axios.get("/api/nanny-profiles");
          setNannies(response.data.data || response.data);
          setLoading(false);
        } catch (error) {
          console.error("Помилка при завантаженні всіх нянь:", error);
        }
      }, []);
    
      useEffect(() => {
        fetchAllNannies();
      }, [fetchAllNannies]);
       
    
      const handleGoToSurvey = async () => {
        const token = localStorage.getItem("authToken");
      
        if (!token) {
          alert("Сесія завершена. Увійдіть знову.");
          navigate("/registrationlogin");
          return;
        }
      
        // Опціонально перевірка, чи токен ще дійсний
        try {
          await axios.get("/api/parent/profile", { withCredentials: true });
          navigate("/registration/parent/survey?from=nanny-list");
        } catch (error) {
          console.warn("Сесія неактивна:", error);
          alert("Сесія завершена. Увійдіть знову.");
          navigate("/registrationlogin");
        }
      };      
        
  
    if (loading) {
      return <LoadingScreen text="Завантаження сторінки..." />;
    }
  
    return (
      <div>
         <VariantHeader />
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
        {filteredSortedNannies.slice(indexOfFirst, indexOfLast).length > 0 ? (
            filteredSortedNannies.slice(indexOfFirst, indexOfLast).map((nanny) => (
              <NannyCard
                key={nanny.id}
                nanny={nanny}
                isFavorite={favoriteIds.includes(nanny.id)}
                onToggleFavorite={() => toggleFavorite(nanny.id)}
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

export default AllNanniesPage;
