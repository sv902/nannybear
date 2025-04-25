import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import "../../styles/bookingModal.css";

const BookingDetailModalNanny = ({ booking, onClose }) => {
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

  const formatTime = (start, end) => {
    return `${start?.slice(0, 5)} - ${end?.slice(0, 5)}`;
  };

  useEffect(() => {
    const parentUserId = booking?.parent?.user?.id;
    if (parentUserId) {
      axios.get(`/api/reviews/about-parent/${parentUserId}`)
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
    
      navigate("/add-parent-review", { state: { booking } });
    };
    
  return (
    <>
    <div className="modal-overlay-container">
      <div className="modal-content-booking">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>     
        <p className="modal-date">{formatDate(booking.date)}</p>       
     
        
        <div className="modal-profile">
        
        {/* Ліва частина: фото + ім’я + зірки */}
        {booking.parent && (  
          <div className="profile-left">
            <img
            src={
                booking.parent?.photo
                ? `${baseUrl}/storage/${booking.parent.photo}`
                : `${baseUrl}/storage/default-avatar.jpg`
            }
            alt="Няня"
            className="nanny-booking-avatar"
            />
            <div>
            <h2 className="nanny-booking-name">
                {booking.parent?.first_name} <br /> {booking.parent?.last_name}
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
                        <linearGradient id={`starGradient-${booking.parent?.id || 'unknown'}-${i}`}>
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                            <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
                        </linearGradient>
                        </defs>
                        <path
                        d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
                        fill={`url(#starGradient-${booking.parent.id}-${i})`}
                        />
                    </svg>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        )}
        {/* Права частина: оплата + чат */}
        <div className="profile-right">
            <div className="modal-price-booking">{booking.total_price} грн</div>
            <button
            className="chat-btn-booking"
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${booking.parent.id}`);
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
            <p className="inf-text">Дата</p>
            <span className="inf-data-booking">{formatDate(booking.date)}</span>
          </div>
          <div className="strip-item pink">
            <p className="inf-text">{formatTime(booking.start_time, booking.end_time)}</p>
            <span className="inf-data-booking">
              {(
                (new Date(`1970-01-01T${booking.end_time}`) -
                  new Date(`1970-01-01T${booking.start_time}`)) /
                3600000
              ).toFixed(0)}{' '}годин
            </span>
          </div>
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

export default BookingDetailModalNanny;
