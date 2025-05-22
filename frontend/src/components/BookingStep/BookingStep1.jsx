import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosConfig";
import "../../styles/booking.css"; 
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";

const BookingStep1 = () => {  
  const navigate = useNavigate();
  const { id } = useParams();
  const [nanny, setNanny] = useState(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    axios.get(`/api/nanny-profiles/${id}`)
      .then((res) => {
        setNanny(res.data);
      })
      .catch((err) => console.error("Помилка завантаження профілю няні:", err));
  }, [id]);
  

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (nanny?.user_id) {
      axios.get(`/api/reviews/${nanny.user_id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Помилка завантаження відгуків:", err));
    }
  }, [nanny]);

  const getLabelForDate = (date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    if (date.toDateString() === today.toDateString()) return "Сьогодні";
    if (date.toDateString() === tomorrow.toDateString()) return "Завтра";
      
    return date.toLocaleDateString("uk-UA", { weekday: "long" });
  };
  
  
  const getNextDays = () => {
    const days = [];
    for (let i = currentStartIndex; i < currentStartIndex + 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleNext = () => {
    if (!selectedTime) return;

    const endTime = (() => {
    const [h, m] = selectedTime.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(h + 1, m || 0);
    return endDate.toTimeString().slice(0, 5);
  })();

      navigate(`/booking/${id}/end`, {
      state: {
        startDate: selectedDate.toISOString().slice(0, 10),
        startTime: selectedTime,
        endDate: selectedDate.toISOString().slice(0, 10), // початково: один і той самий день
        endTime: endTime, // обчислюється +1 год від startTime
      }
    });      
  };

  const fetchTimeSlots = useCallback((date) => {
    const formattedDate = date.toISOString().split('T')[0];
    axios.get(`/api/working-hours/${id}/${formattedDate}`)
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error("Помилка завантаження слотів:", err));
  }, [id]);
    
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, fetchTimeSlots]);  
  

  const averageRating = reviews.length > 0
  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  : "—";

 
  if (!nanny) return <div>Завантаження...</div>;

  return (
    <div className="booking-page">
      <VariantHeader />
      <div className="booking-container">
      <div className="booking-top-row">
        <div className="back-and-step">
          <button className="back-button-dark btn-next-booking" onClick={() => navigate(-1)}>
            <span className="back-text">НАЗАД</span>
            <span className="back-arrow-dark"></span>
          </button>
          <span className="step-indicator">Крок 1/4</span>
        </div>
      </div>

        <div className="booking-header-row">
          <h1 className="booking-title">ПЛАНУВАННЯ ЗУСТРІЧІ З</h1>

          <div className="nanny-profile-preview-edit-booking">
            <img
              src={nanny.photo}
              alt="Няня"
              className="nanny-booking-avatar-edit"
            />
            <div>
              <h2 className="nanny-booking-name">
                {nanny?.first_name} <br/> {nanny?.last_name}
              </h2>
              <div className="rating-stars-card-booking">
                {[1, 2, 3, 4, 5].map((i) => {
                  const fillLevel = averageRating ? Math.min(Math.max(averageRating - i + 1, 0), 1) : 0.7;
                  return (
                    <div className="star-wrapper" key={i}>
                      <svg viewBox="0 0 20 20" className="star" xmlns="http://www.w3.org/2000/svg">
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
        </div>

        <div className="booking-subtitle-row">
          <h2 className="booking-subtitle">ОБЕРІТЬ ЧАС</h2>
          <p className="booking-description">оберіть дату та час початку зустрічі</p>
        </div>

        <div className="date-navigation">
        <button
          className="nav-arrow-booking left"
          onClick={() => setCurrentStartIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentStartIndex === 0}
        >
          ←
        </button>

        <div className="date-selector">
          {getNextDays().map((date, idx) => (
            <button
              key={idx}
              className={`date-button ${
                selectedDate.toDateString() === date.toDateString() ? "active" : ""
              }`}
              onClick={() => setSelectedDate(date)}
            >
              
              <div className="day-label">{getLabelForDate(date)}</div>
              <div className="date-label">
                {date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
              </div>
            </button>
          ))}
        </div>

        <button
          className="nav-arrow-booking right"
          onClick={() => setCurrentStartIndex((prev) => prev + 1)}
        >
          →
        </button>
      </div>

      <div className="time-container">
       <p className="timezone-label">За Вашим місцевим часом</p>
       <div className="time-slot-grid">
          {timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`time-slot ${selectedTime === slot.start_time ? "selected" : ""}`}
                onClick={() => setSelectedTime(slot.start_time)}
              >
                {slot.start_time.slice(0, 5)}
              </button>
            ))
          ) : (
            <p className="timezone-label">Немає доступних годин на цю дату.</p>
          )}
        </div>

                </div>

                <button className="next-button-booking" onClick={handleNext} disabled={!selectedTime}>
                  ДАЛІ
                </button>
              </div>
              <Footer />
            </div>
          );
        };

export default BookingStep1;
