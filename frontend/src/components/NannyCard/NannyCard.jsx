import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/nannycard.css";
import briefcaseIcon from "../../assets/icons/briefcase.svg";
import locationIcon from "../../assets/icons/location.svg";

import { useFavorites } from "../../context/FavoritesContext";
import axios from "../../axiosConfig";


const NannyCard = ({ nanny }) => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  
  const isFavorite = favoriteIds.some((fav) => fav.nanny_id === nanny.id);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const genderClass = nanny.gender === "female" ? "female" : "male";
  const avatar = nanny.photo ? `${baseUrl}/storage/${nanny.photo}` : `${baseUrl}/storage/default-avatar.jpg`;
  const [reviews, setReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); 
  const [, setBookings] = useState(0);

  const averageRating =
  reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 3.5;

  const reviewsCount = reviews.length || 100;// placeholder
  
  const [clients, setClients] = useState(100); // fallback
  const [hoursWorked, setHoursWorked] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!nanny || !nanny.user_id) return;
  
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews/${nanny.user_id}`);
        setReviews(response.data);
        setIsLoaded(true); 
      } catch (error) {
        console.error("Помилка при завантаженні відгуків:", error);
        setIsLoaded(true);
      }
    };
  
    fetchReviews();
  }, [nanny]);

  useEffect(() => {
    if (!nanny || !nanny.id) return;
  
    axios.get(`/api/nanny/${nanny.id}/bookings`).then(res => {
      const bookingDays = res.data.flatMap(b => b.booking_days || []);
      setBookings(res.data.length);
  
      const uniqueClients = new Set(res.data.map(b => b.parent_id));
      setClients(uniqueClients.size);
  
      const totalHours = bookingDays.reduce((acc, day) => {
        const start = new Date(`1970-01-01T${day.start_time}`);
        const end = new Date(`1970-01-01T${day.end_time}`);
        return acc + (end - start) / 3600000;
      }, 0);
      setHoursWorked(totalHours);   
    }).catch(err => {
      console.error("❌ Помилка при завантаженні бронювань:", err);
    });
  }, [nanny]);
  

  return (
    <div className={`nanny-card`} onClick={() => navigate(`/nanny-profiles/${nanny.id}`)}>
        <div className={`nanny-card-header ${genderClass}`}>
          <div className="nanny-avatar">
            <img src={avatar} alt="avatar" className="nanny-avatar" />          
          </div>
          
          <div className="nanny-name-reviews">
          <h3 className="nanny-name">{nanny.first_name || "Без імені"}</h3>
              <span className="reviews"> {isLoaded ? `${reviewsCount}+ відгуків` : "Завантаження..."}</span> 
              <div className="client-info">
              <span>{clients}+ клієнтів</span>
              <span>&bull;{hoursWorked}+ годин</span>
            </div> 
        </div>           
         <div className="rating">
         <button
            className="favorite-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) {  // Перевірка, чи триває операція
                setIsLoading(true);
                toggleFavorite(nanny.id);            
              }
            }}
            disabled={isLoading} 
          >
            <svg
              viewBox="0 0 32 29.6"
              fill={isFavorite ? "#3A3B61" : "none"}
              xmlns="http://www.w3.org/2000/svg"
              stroke="#3A3B61"
              strokeWidth="1.5"
              className="heart-svg"
            >
              <path
                d="M16 29s-1.5-1.2-4.4-3.3C7.4 22.3 2 17.5 2 11.5 2 6.8 6 3 10.5 3c2.7 0 4.5 1.5 5.5 3.1C17 4.5 18.8 3 21.5 3 26 3 30 6.8 30 11.5c0 6-5.4 10.8-9.6 14.2-2.9 2.1-4.4 3.3-4.4 3.3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="rating-stars-card">
          {[1, 2, 3, 4, 5].map((i) => {
    const fillLevel = averageRating
      ? Math.min(Math.max(averageRating - i + 1, 0), 1)
      : 0.7; // placeholder

              return (
                <div className="star-wrapper" key={i}>
                  <svg
                    viewBox="0 0 20 20"
                    className="star"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`starGradient-${nanny.id}-${i}`}>
                        <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                        <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
                      fill={`url(#starGradient-${nanny.id}-${i})`}
                    />
                  </svg>
                </div>
              );
            })}
          </div>


      </div>
      </div>

      <div className="match-wrapper">
        <div className="match-text">
          {nanny.first_name} підходить вам на {nanny.match_percent || 92}%
        </div>
        <div className="match-bar">
          <div
            className="match-bar-fill"
            style={{ width: `${nanny.match_percent || 82}%` }}
          ></div>
        </div>
      </div>

      <div className="goal">
        {nanny.about_me || "Моя мета — піклуватися про ваших дітей, забезпечуючи їм безпеку та комфорт. Я організовую цікаві заняття і допомагаю в їх розвитку."}
      </div>

      <div className="types-scroll-wrapper">
        <div className="types-scroll">
          {nanny.specialization?.map((type, idx) => (
            <span key={idx}>{type}</span>
          ))}
        </div>
      </div>

      <div className="bottom-details">
      <div className="bottom-details-row">
        <div className="left-info">
          <div className="experience">
            <img src={briefcaseIcon} alt="досвід" className="icon-card" />
            <span className="yers-city">{Math.floor(nanny.experience_years)}+ років </span>
            <span className="yers-city-text">досвіду</span>
          </div>
          <div className="location">
            <img src={locationIcon} alt="локація" className="icon-card" />
            <span className="yers-city">{nanny.city}, </span>
            <span className="yers-city-text">{nanny.district}</span>
          </div>
        </div>

        <div className="rate">
          {Math.floor(nanny.hourly_rate)} ₴
        </div>
      </div>
        <div className="actions">
        <button className="chat-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chat/${nanny.id}`);
          }}
        >
                   <span className="icon-btn-chat" /> Чат
                  </button>
        <button className="calendar-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/booking/${nanny.id}`);
          }}
        >
          <span className="icon-btn-calendar" /> Запланувати</button>
      </div>
      </div>
    </div>
  );
};

export default NannyCard;
