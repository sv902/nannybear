import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../../styles/bookingModal.css";
import "../../styles/modal.css";
import DeleteBookingConfirmModalParent from "../Modal/DeleteBookingConfirmModalParent";
import TooEarlyReviewModal from "./TooEarlyReviewModal";

const BookingDetailModalParentCalendar = ({ bookings, initialIndex = 0, onClose, onDelete, onRefresh }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
 
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const [reviews, setReviews] = useState([]);
  const [showTooEarlyModal, setShowTooEarlyModal] = useState(false);
  const [booking, setBooking] = useState(bookings[initialIndex]);
  
  useEffect(() => {
    const nannyUserId = booking?.nanny?.user?.id;
    if (nannyUserId) {
      axios.get(`/api/reviews/about-nanny/${nannyUserId}`)
  .then(res => {
    if (Array.isArray(res.data)) {
      setReviews(res.data);
    } else {
      console.warn("Очікував масив відгуків, але отримав:", res.data);
      setReviews([]);
    }
  })
  .catch(err => {
    console.error("Помилка завантаження відгуків:", err);
    setReviews([]);
  });

    }
  }, [booking]);

  useEffect(() => {
      if (bookings[currentIndex]) {
        setBooking(bookings[currentIndex]);
      }
    }, [currentIndex, bookings]);
  
    if (!booking) return null;

const validReviews = Array.isArray(reviews) ? reviews : [];

const averageRating = validReviews.length > 0
  ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1)
  : "—";


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
  };

  const handleAddReview = () => {
    if (!booking || !booking.date) return;
  
    const today = new Date();
    const bookingDate = new Date(booking.date);
  
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()).getTime();
  
    if (bookingDateOnly > todayDate) {
      setShowTooEarlyModal(true); 
      return;
    }
  
    navigate("/add-review", { state: { booking } });
  };   

  const getDateLabel = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    if (date.toDateString() === today.toDateString()) return "СЬОГОДНІ";
    if (date.toDateString() === tomorrow.toDateString()) return "ЗАВТРА";
  
    return date.toLocaleDateString("uk-UA", { weekday: "long" }).toUpperCase(); // Наприклад: "СЕРЕДА"
  };

  const isPastMeeting = () => {
    const now = new Date();
    const endDateTime = new Date(`${booking.end_date}T${booking.end_time}`);
    return endDateTime < now;
  };   

  const handleDelete = (id) => {
    axios.delete(`/api/bookings/${id}`)
        .then(() => {
        alert("Бронювання скасовано");
        onClose(); 
        onRefresh(); // ⬅ оновлення бронювань у розкладі
      })
      .catch((err) => {
        console.error("Помилка при видаленні зустрічі:", err);
        alert("Не вдалося видалити зустріч. Спробуйте пізніше.");
      });
  };
  console.log("booking_days:", booking.booking_days);

  const totalHours = booking.booking_days?.reduce((sum, day) => {
    const start = new Date(`1970-01-01T${day.start_time}`);
    const end = new Date(`1970-01-01T${day.end_time}`);
    return sum + (end - start) / 3600000;
  }, 0);

  const formatDateperiod = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year} р.`;
  };
   
  return (
    <div className="modal-overlay-container">
      <div className="modal-content-booking">
        <button className="modal-close" onClick={onClose}>✖</button>

        <div className="modal-header-booking">
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
        </div>

        <div className="modal-profile">
        <div
          className="profile-left clickable-parent-profile"
          onClick={() => navigate(`/nanny-profiles/${booking.nanny.id}`)}
        >
          <img
            src={
                booking.nanny?.photo_url
                || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/nannies/default-avatar.jpg"
            }
            alt="Няня"
            className="nanny-booking-avatar"
          />
          <div>
          <h2
            className="nanny-booking-name"
            onClick={() => {
              onClose();
              navigate(`/nanny/${booking.nanny.user_id}`);
            }}
            style={{ cursor: "pointer" }}
          >
            {booking.nanny?.first_name} <br /> {booking.nanny?.last_name}
          </h2>
              <div className="rating-stars-card-booking">
                {[1, 2, 3, 4, 5].map((i) => {
                 const numericRating = parseFloat(averageRating);
                 const fillLevel = !isNaN(numericRating)
                   ? Math.min(Math.max(numericRating - i + 1, 0), 1)
                   : 0.7;
                 
                  return (
                    <div className="star-wrapper" key={i}>
                      <svg viewBox="0 0 20 20" className="star" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id={`starGradient-${booking.nanny?.id || 'unknown'}-${i}`}>
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
                          fill={`url(#starGradient-${booking.nanny?.id}-${i})`}
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="profile-right">
            <div className="modal-price-booking">{booking.total_price} грн</div>
            <button className="chat-btn-booking" onClick={() => navigate(`/chat/${booking.nanny.id}`)}>
              <span className="icon-btn-chat" /> ЧАТ
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
            {booking.address?.city}, {booking.address?.address}, {booking.address?.floor} поверх, кв {booking.address?.apartment}
          </p>
        </div>

        <div className="modal-actions">
          <button
            className="add-review-btn"
            onClick={handleAddReview}            
          >
            ДОДАТИ ВІДГУК
          </button>

          {isPastMeeting() ? (
            <p className="cancel-link disabled-link">Зустріч відбулася</p>
          ) : (
            <p className="cancel-link" onClick={() => setShowDeleteConfirm(true)}>
              Видалити цю зустріч
            </p>
          )}
        </div>

        <div className="modal-nav-arrows">
        <button
        onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
        disabled={currentIndex === 0}
      >
        ←
      </button>
      <button
        onClick={() => setCurrentIndex(prev => Math.min(prev + 1, bookings.length - 1))}
        disabled={currentIndex === bookings.length - 1}
      >
        →
      </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteBookingConfirmModalParent
          onConfirm={() => handleDelete(booking.id)}
          onCancel={() => setShowDeleteConfirm(false)}
        />
        )}
        
        {showTooEarlyModal && <TooEarlyReviewModal onClose={() => setShowTooEarlyModal(false)} />}

    </div>
  );
};

export default BookingDetailModalParentCalendar;
