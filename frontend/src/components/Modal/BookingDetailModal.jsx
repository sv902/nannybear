import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../../styles/bookingModal.css";

const BookingDetailModal = ({ booking, onClose }) => {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate(); 
    
    // const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false);
    // const [showBeforeMeetingModal, setShowBeforeMeetingModal] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

 
  useEffect(() => {
    if (booking?.nanny?.user_id) {
      axios.get(`/api/reviews/${booking.nanny.user_id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Помилка завантаження відгуків:", err));
    }
  }, [booking]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
      
    const handleAddReview = () => {
      const today = new Date();
      const bookingDate = new Date(booking.date);
    
      if (bookingDate > today) {
        // setShowBeforeMeetingModal(true);
        return;
      }
    
      navigate("/add-review", { state: { booking } });
    };

    const totalHours = booking.booking_days?.reduce((sum, day) => {
      const start = new Date(`1970-01-01T${day.start_time}`);
      const end = new Date(`1970-01-01T${day.end_time}`);
      return sum + (end - start) / 3600000;
    }, 0);

    const getDateLabel = (dateStr) => {
      const today = new Date();
      const date = new Date(dateStr);
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
    
      if (date.toDateString() === today.toDateString()) return "СЬОГОДНІ";
      if (date.toDateString() === tomorrow.toDateString()) return "ЗАВТРА";
    
      return date.toLocaleDateString("uk-UA", { weekday: "long" }).toUpperCase(); // Наприклад: "СЕРЕДА"
    };

    const formatDateperiod = (dateStr) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year} р.`;
    };
    
  return (
    <>
    <div className="modal-overlay-container">
      <div className="modal-content-booking">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>     
        <p className="modal-date">
          {booking.start_date === booking.end_date ? (
            formatDate(booking.start_date)
          ) : (
            <>
              {formatDate(booking.start_date)} – {formatDate(booking.end_date)}
            </>
          )}
        </p>    
        {booking.booking_days && booking.booking_days.length > 0 && (() => {
      const uniqueDates = new Set(booking.booking_days.map(d => d.date));
 
      const meetingCount = new Set(booking.booking_days.map(d => d.booking_id)).size;

  
          if (uniqueDates.size === 1) {
            const sortedStarts = [...booking.booking_days].map(t => t.start_time).sort();
            const sortedEnds = [...booking.booking_days].map(t => t.end_time).sort();

            return (
              <p className="modal-count">
                {sortedStarts[0].slice(0, 5)} – {sortedEnds[sortedEnds.length - 1].slice(0, 5)}
                {" · "}
                {meetingCount} зустріч{meetingCount > 1 ? "і" : ""}
                {" · "}
                {totalHours.toFixed(0)} год.
              </p>
            );
          } else {
            return (
              <p className="modal-count">
                {uniqueDates.size} дн. · {meetingCount} зустріч{meetingCount > 1 ? "і" : ""} · {totalHours.toFixed(0)} год.
              </p>
            );
          }
        })()}   
     
        
        <div className="modal-profile">
        {/* Ліва частина: фото + ім’я + зірки */}
        <div className="profile-left"
         onClick={() => navigate(`/nanny-profiles/${booking.nanny.id}`)}
        >
            <img            
            src={
                booking.nanny?.photo
                || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/nannies/default-avatar.jpg"
            }
            alt="Няня"
            className="nanny-booking-avatar"
            />
            <div>
            <h2 className="nanny-booking-name">
                {booking.nanny?.first_name} <br /> {booking.nanny?.last_name}
            </h2>
            <div className="rating-stars-card-booking">
                {[1, 2, 3, 4, 5].map((i) => {
                const fillLevel = averageRating
                    ? Math.min(Math.max(averageRating - i + 1, 0), 1)
                    : 0.7;

                return (
                    <div className="star-wrapper" key={i}>
                    <svg viewBox="0 0 20 20" className="star" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                        <linearGradient id={`starGradient-${booking.nanny.id}-${i}`}>
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
                        </linearGradient>
                        </defs>
                        <path
                        d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
                        fill={`url(#starGradient-${booking.nanny.id}-${i})`}
                        />
                    </svg>
                    </div>
                );
                })}
            </div>
            </div>
        </div>

        {/* Права частина: оплата + чат */}
        <div className="profile-right">
            <div className="modal-price-booking">{booking.total_price} грн</div>
            <button
            className="chat-btn-booking"
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${booking.nanny.id}`);
            }}
            >
            <span className="icon-btn-chat" /> 
            Чат
            </button>
        </div>
        </div>

        <div className="modal-strip">
        <div className="strip-item dark with-left-ear-booking">
        <div className="ear-booking left-ear-booking"></div>
        <p className="inf-text">
                {booking.start_date === booking.end_date
                  ? getDateLabel(booking.start_date)
                  : "ПЕРІОД"}
              </p>
              <span className="inf-data-booking">
                {booking.start_date === booking.end_date
                  ? formatDate(booking.start_date)
                  : `${formatDateperiod (booking.start_date)} – ${formatDateperiod (booking.end_date)}`}
              </span>
          </div>
        
          {booking.booking_days && new Set(booking.booking_days.map(d => d.date)).size === 1 ? (() => {
              const sortedStarts = booking.booking_days.map(d => d.start_time).sort();
              const sortedEnds = booking.booking_days.map(d => d.end_time).sort();

              return (
                <div className="strip-item pink">
                  <p className="inf-text"> {sortedStarts[0].slice(0, 5)} – {sortedEnds[sortedEnds.length - 1].slice(0, 5)}</p>
                  <span className="inf-data-booking">{totalHours.toFixed(0)} годин</span>
                </div>
              );
            })() : (
              <div className="strip-item pink">
                <p className="inf-text">Всього</p>
                <span className="inf-data-booking">{totalHours.toFixed(0)} годин</span>
              </div>
            )}
         
          <div className="strip-item blue">
            <p className="inf-text">ОПЛАТА НЯНІ</p>
            <span className="inf-data-booking">{booking.hourly_rate} грн / год.</span>
          </div>
          <div className="strip-item orange with-right-ear-booking">
          <div className="ear-booking right-ear-booking"></div>
            <p className="inf-text">ОПЛАТА</p>
            <span className="inf-data-booking">{booking.payment_type === "card" ? "Карткою" : "Готівкою"}</span>
          </div>
        </div>

        <div className="modal-address">
          <h3>АДРЕСА</h3>
          <p>
            {booking.address?.type}: {booking.address?.city}, {booking.address?.address}, {booking.address?.floor} поверх, кв {booking.address?.apartment}
          </p>
        </div>

        <div className="modal-actions">
        <button className="add-review-btn" onClick={handleAddReview}>
          ДОДАТИ ВІДГУК
        </button>
          {/* <p className="cancel-link">Видалити цю зустріч</p> */}
        </div>
      </div>
    </div>
    
      {/* {showAlreadyReviewedModal && (
        <div className="error-overlay">
          <div className="error-modal">
            <button className="modal-close-err" onClick={() => setShowAlreadyReviewedModal(false)}>✖</button>
            <h2>Помилка!</h2>
            <p>Ми вже отримали Ваш відгук.</p>
            <p>Дякуємо, що ділитеся своєю думкою!</p>
            <button className="error-modal-btn-ok" onClick={() => setShowAlreadyReviewedModal(false)}>Добре</button>
          </div>
        </div>
      )}


          {showBeforeMeetingModal && (
            <div className="error-overlay">
              <div className="error-modal">
                <button className="modal-close-err" onClick={() => setShowBeforeMeetingModal(false)}>✖</button>
                <h2>Помилка!</h2>
                <p>Зустріч має відбутися, перш ніж Ви <br/> зможете оцінити няню.</p>
                <p>Поверніться після завершення зустрічі!</p>
                <button className="error-modal-btn-ok" onClick={() => setShowBeforeMeetingModal(false)}>Добре</button>
              </div>
            </div>
          )} */}
    </>
  );
};

export default BookingDetailModal;
