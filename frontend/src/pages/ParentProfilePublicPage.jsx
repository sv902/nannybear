import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/nannydetail.css";
import "../styles/profile.css"
import "../styles/nannycard.css";
import VariantHeaderNanny from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";
import BearPlaceholder from "../components/BearPlaceholder/BearPlaceholder";
import locationIcon from "../assets/icons/location.svg";
import chatIcon from "../assets/icons/chat.svg";

const ParentProfilePage = () => {
    const { id } = useParams(); 
  const navigate = useNavigate();  

  const [parent, setParentProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 4;

  useEffect(() => {
    axios.get(`/api/parent-profiles/${id}`)
      .then((res) => {
        const profile = res.data;
        console.log("📦 Отриманий профіль:", profile);
        setParentProfile(profile);
  
        // одразу завантажуємо відгуки, якщо є user_id
        if (profile.user_id) {
          axios.get(`/api/reviews/about-parent/${profile.user_id}`)
            .then((res) => {
              console.log("✅ Відгуки про батька:", res.data);
              setReviews(res.data);
            })
            .catch((err) => console.error("❌ Помилка при завантаженні відгуків про батька:", err));
        }
      })
      .catch((err) => console.error("❌ Помилка при завантаженні профілю:", err));
  }, [id]);
   
  useEffect(() => {
    axios.get("/api/user")
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("❌ Помилка при отриманні користувача:", err));
  }, []);       

   
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = currentPage * reviewsPerPage;
  const visibleReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
   
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 4.5;

  const getreReviewsLabel = (count) => {
    if (count === 1) return "відгук";
    if (count >= 2 && count <= 4) return "відгуки";
    return "відгуків";
  };

  const getChildLabel = (count) => {
    if (count === 1) return "дитина";
    if (count >= 2 && count <= 4) return "дитини";
    return "дітей";
  };  

  const renderStars = (rating, keyPrefix = "parent") =>
    [1, 2, 3, 4, 5].map((i) => {
      const fillLevel = Math.min(Math.max(rating - i + 1, 0), 1);
      return (
        <div className="star-wrapper" key={`${keyPrefix}-${i}`}>
          <svg viewBox="0 0 20 20" className="star">
            <defs>
              <linearGradient id={`starGradient-${keyPrefix}-${i}`}>
                <stop offset={`${fillLevel * 100}%`} stopColor="#CC8562" />
                <stop offset={`${fillLevel * 100}%`} stopColor="#CC856280" />
              </linearGradient>
            </defs>
            <path
              d="M12 2L14.9 8.62L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.62L12 2Z"
              fill={`url(#starGradient-${keyPrefix}-${i})`}
            />
          </svg>
        </div>
      );
    });

  const calculateAge = (birthDateStr) => {
    const birthDate = new Date(birthDateStr);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const totalBookings = parent?.total_bookings || 100; // placeholder
    
  if (!parent) return <div>Завантаження...</div>;
  
  const mainAddress = parent.addresses?.[0] || {};

 return (
    <div>
      <VariantHeaderNanny />
      <div className="profile-page-container">
      
      <div className="profile-header">
          <div className="left-header">
            <button onClick={() => navigate(-1)} className="back-button-dark">
              <span className="back-text">НАЗАД</span>
              <span className="back-arrow-dark"></span>
            </button>
          </div>
         
        </div>


        <div className="profile-columns">
        <div className="left-column-parent-prof">
          <div className="photo-wrapper">
            <img
              src={parent.photo_url}
              alt="Фото батька"
              className="nanny-photo-large"
            />
            <div className="rating-stars">{renderStars(averageRating)}</div>
           
            <p className="booking-total">{totalBookings}+ бронювань</p>
          </div>
        
          <h2 className="parent-name-prof">{parent.first_name} <br/> {parent.last_name}</h2>

          <div className="location-parent-profile">
            <img src={locationIcon} alt="локація" className="icon-card" />
            <p className="city-parent-prof">
            {mainAddress.city || "—"},{" "}
            <span className="dist-parent-prof">
              {mainAddress.district || "—"}
            </span>
          </p>
          </div>

          <button className="chat-btn-parent-prof" onClick={() => navigate(`/chat/${parent.user_id}`)}>
            <img src={chatIcon} alt="чат" className="icon-btn-card" />
            Чат
          </button>
        </div>

        <div className="right-column-parent-prof">
          <div className="children-header">
            <h3>Діти</h3>
            <span className="children-count">
              {parent.children?.length || 0} {getChildLabel(parent.children?.length || 0)}
            </span>
          </div>
          
          <div className="children-container">
            <div className="children-column">
              {parent.children?.slice(0, 7).map((child, idx) => (
                <div key={idx} className="child-info">
                  <p className="children-name">{child.name},</p>
                  <p className="children-yers">{calculateAge(child.birth_date)} років</p>
                </div>
              ))}
            </div>

            <div className="children-column">
              {parent.children?.slice(7, 14).map((child, idx) => (
                <div key={idx + 7} className="child-info">
                  <p className="children-name">{child.name},</p>
                  <p className="children-yers">{calculateAge(child.birth_date)} років</p>
                </div>
              ))}
            </div>
          </div>

          
        </div>

        </div>
      </div>

      {/* ВІДГУКИ */}
      <div className="reviews-section">
        <div className="review-header">
          <h3>Відгуки</h3>
          {reviews.length > 0 && (
            <div className="review-summary">
              <span className="review-count">{reviews.length} {getreReviewsLabel(reviews.length)}</span>
              <span className="average-stars review-average">
              {averageRating.toFixed(1)}
              <span className="stars-inline">{renderStars(averageRating)}</span>
            </span>
            </div>
          )}
        </div>

        <div className="reviews-slider">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((review, idx) => (
              <div key={idx} className="review-item">
                <img
                  src={
                    review.nanny?.photo_url                     
                  }
                  alt="Аватар"
                  className="review-avatar"
                />
                <div className="review-text">
                <strong className="name-parent-rev">
                  {review.nanny?.first_name}{" "}
                  {review.nanny?.last_name?.charAt(0)}.
                </strong>
                  <div className="stars">
                    {renderStars(review.rating, review.id || idx)}
                  </div>
                  <p className="coment-text">{review.comment}</p>
                </div>
                <div className="review-date">
                  {new Date(review.created_at).toLocaleDateString("uk-UA")}
                </div>
              </div>
            ))            
          ) : (
            <div className="bear-placeholder-reviews"><BearPlaceholder /></div>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="review-footer">
            <div className="review-navigation">
              <button onClick={handlePrev} disabled={currentPage === 0}>&#8592;</button>
              <span>{startIndex + 1}-{Math.min(startIndex + reviewsPerPage, reviews.length)} з {reviews.length} відгуків</span>
              <button onClick={handleNext} disabled={currentPage >= totalPages - 1}>&#8594;</button>
            </div>
          </div>
        )}
      </div>

      {/* СКАРГА */}      
        <div className="complaint-button">
          <button className="report-profile-btn" onClick={() => navigate(`/report/${parent.user_id}`)}>
            Поскаржитись на цей профіль
          </button>
        </div>

      <Footer />
    </div>
  );
};

export default ParentProfilePage;
