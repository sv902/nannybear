import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import VariantHeader from "../components/Header/VariantHeader";
import { useFavorites } from "../context/FavoritesContext";
import Footer from "../components/Footer/Footer";
import "../styles/review.css";
import "../styles/nannydetail.css";
import "../styles/nannycard.css";
import ThankYouModal from "../components/Modal/ThankYouModal";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import locationIcon from "../assets/icons/location.svg";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const AddReviewPage = () => {
  const navigate = useNavigate();
  const [nanny, setNanny] = useState(null);
  const { favoriteIds, toggleFavorite } = useFavorites();  
  const location = useLocation();
  const booking = location.state?.booking;  

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");

  const genderClass = nanny?.gender === "female" ? "female" : "male";
  const isFavorite = nanny && favoriteIds.some((fav) => fav.nanny_id === nanny.id);
  const clients = nanny?.total_clients || 100;
  const hoursWorked = nanny?.total_hours || 100;
  const [showModal, setShowModal] = useState(false);
  const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false);

  useEffect(() => {
    if (booking?.nanny) {
      console.log("booking.nanny:", booking.nanny);
      setNanny(booking.nanny);
    }
  }, [booking]);
   
  const [reviews, setReviews] = useState([]); 

  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;
          
      useEffect(() => {
        if (!nanny || !nanny.user_id) return;
      
        const fetchReviews = async () => {
          try {
            const response = await axios.get(`/api/reviews/${nanny.user_id}`);
            console.log("Відгуки, які будуть рендеритись:", response.data);
            setReviews(response.data);
          } catch (error) {
            console.error("Помилка при завантаженні відгуків:", error);
          }
        };
      
        fetchReviews();
      }, [nanny]);

  const renderStars = (rating, uniqueKey = "") => {
    return [1, 2, 3, 4, 5].map((index) => {
      const fillLevel = Math.min(Math.max(rating - index + 1, 0), 1);
      const gradientId = `starGradient-${uniqueKey}-${index}`;
  
      return (
        <div className="star-wrapper-det" key={index}>
          <svg
            viewBox="0 0 20 20"
            className="star"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={gradientId}>
                <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
              </linearGradient>
            </defs>
            <path
              d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
              fill={`url(#${gradientId})`}
            />
          </svg>
        </div>
      );
    });
  }; 

  useEffect(() => {
    const checkIfAlreadyReviewed = async () => {
      try {
        const res = await axios.get(`/api/reviews/${booking.nanny.user_id}`);
        const alreadyReviewed = res.data.some(
          (r) => r.parent_id === booking.parent_id
        );
        if (alreadyReviewed) {
          setShowAlreadyReviewedModal(true);
        }
      } catch (err) {
        console.error("Помилка перевірки наявного відгуку:", err);
      }
    };

    if (booking?.parent_id && booking?.nanny?.user_id) {
      checkIfAlreadyReviewed();
    }
  }, [booking]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!comment.trim()) {
      setError("Будь ласка, напишіть відгук.");
      return;
    }
  
    if (rating < 1) {
      setError("Будь ласка, поставте хоча б одну зірку.");
      return;
    }

    if (!booking) {
      return <div>❌ Неможливо залишити відгук без бронювання</div>;
    }
  
    try {
      await axios.post("/api/reviews", {
        rating,
        comment,
        is_anonymous: isAnonymous,
        booking_id: booking.id,
        nanny_id: booking.nanny.user_id,
      });
    
      setShowAlreadyReviewedModal(false);
      setError("");
      setShowModal(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setShowAlreadyReviewedModal(true);
      } else if (err.response?.status === 422) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError("Не вдалося зберегти відгук. Спробуйте ще раз.");
      }
    }    
    
  };

  if (!booking || !nanny) {
    return <LoadingScreen text="Завантаження сторінки..." />;
  }  

  return (
    <div>
      <VariantHeader />
      <div className="review-page-container">
        <button className="back-button-dark" onClick={() => navigate(-1)}>
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="review-page-title">ЗАЛИШИТИ ВІДГУК</h1>

        {showAlreadyReviewedModal && (
          <div className="error-overlay">
            <div className="error-modal">
              <button className="modal-close-err" onClick={() => navigate(-1)}>✖</button>
              <h2>Помилка!</h2>
              <p>Ви вже залишили відгук для цієї няні.</p>
              <p>Дякуємо, що ділитеся своєю думкою!</p>
              <button className="error-modal-btn-ok" onClick={() => navigate(-1)}>
               Добре
              </button>
            </div>
          </div>
        )}

        <div className="review-content">
          {/* LEFT BLOCK */}
         <div className={`nanny-colom-color ${genderClass}`}> 
                 <button
                   className="favorite-icon-nanny"
                   onClick={(e) => {
                     e.stopPropagation();
                     toggleFavorite(nanny.id);
                   }}
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
               
                 <div className="photo-wrapper">
                   <img
                      src={
                        nanny?.photo_url ||
                        "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/nannies/default-avatar.jpg"
                      }
                      alt="Фото няні"
                      className="nanny-photo-large"
                    />      
                 </div>
           
                   <div className="rating-stars">
                   {renderStars(averageRating, "avg")}
                   </div>
         
                   <div className="client-info">
                     <span>{clients}+ клієнтів</span>
                     <span>&bull;{hoursWorked}+ годин</span>
                   </div>
                 <div className="text-name-nanny">
                   <h1>{nanny.first_name} {nanny.last_name}</h1>
                   {/* <p className="goal">{nanny.goal}</p> */}
                 </div>
         
                 <div className="match-wrapper-nanny">
                 <div className="match-text-nanny">
                   {nanny.first_name} підходить вам на
                 </div>
                 <div className="match-bar-nanny">
                 <div
                     className="match-bar-fill-nanny"
                     style={{ width: `${nanny.match_percent || 82}%` }}
                     >
                     <span className="match-percent-text">
                         {nanny.match_percent || 92}%
                     </span>
                     </div>
                 </div>
               </div>
         
                 <div>
                     <div className="bottom-details-row">
                       <div className="left-info">
                         <div className="experience-rev">
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
                     </div>
                     <p className="title-text-nanny-rev">Оплата за годину</p>
                       <p style={{
                         fontFamily: "'Comfortaa', sans-serif",
                         fontWeight: 400,
                         fontSize: "14px",
                         lineHeight: "120%",
                         letterSpacing: "-2%",
                         color: "#3A3B61",
                         paddingLeft: "20px",
                         paddingTop: "5px",
                         textAlign: "left",
                       }}>
                         середня оплата в місті Київ: 350 грн
                       </p>
                       <div className="rate">
                         {Math.floor(nanny.hourly_rate)} ₴
                       </div>
                       <div className="actions-nanny">
                       <button className="chat-btn-nanny-det"
                         onClick={(e) => {
                           e.stopPropagation();
                           navigate(`/chat/${nanny.id}`);
                         }}
                       >
                          <span className="icon-btn-chat" /> Чат</button>
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

          {/* RIGHT BLOCK */}
          <div className="review-form-block">
           <div className="star-container">
            <h2 className="review-subtitle">ЗІРОЧКИ ДЛЯ НЯНІ:</h2>
            <div className="rating-stars-rev">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn-rev ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div></div>
            <h3 className="review-comment-label">НАПИШІТЬ КОМЕНТАР ДЛЯ НЯНІ</h3>
         
            <div  className="textarea-wrapper">
            <textarea
              placeholder="Поділіться своїми враженнями про няню! Ваш відгук допоможе іншим батькам зробити правильний вибір та підтримає нашу няню..."
              className="review-textarea"
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
                <div className="char-counter">{comment.length}/1000</div>
            </div>
            
            <div className="review-options">
              <label className="anon-checkbox">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                   className="custom-checkbox"
                />
                АНОНІМНИЙ ВІДГУК
              </label>            
            </div>
           
            <button className="submit-review-btn" onClick={handleSubmit}>
              ВІДПРАВИТИ ВІДГУК
            </button>
            {showModal && <ThankYouModal onClose={() => navigate("/nanny-profiles")} />}
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddReviewPage;