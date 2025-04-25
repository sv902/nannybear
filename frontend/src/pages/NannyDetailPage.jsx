// src/pages/NannyDetailPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/nannydetail.css";
import "../styles/nannycard.css";
import eye from "../icons/eye.png";

import BearPlaceholder from "../components/BearPlaceholder/BearPlaceholder";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import locationIcon from "../assets/icons/location.svg";
import { useFavorites } from "../context/FavoritesContext";
import VariantHeader from "../components/Header/VariantHeader";
import Footer from "../components/Footer/Footer";

const NannyDetailPage = () => {
    const [nanny, setNanny] = useState(null);
    const { favoriteIds, toggleFavorite } = useFavorites();   
    const { id } = useParams();
    const navigate = useNavigate();   

    const [isExpanded, setIsExpanded] = useState(false); 
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    
    const [diplomaPreviewUrl, setDiplomaPreviewUrl] = useState(null);
    const closeModal = () => setDiplomaPreviewUrl(null); 
    const [reviews, setReviews] = useState([]);   

    const [currentPage, setCurrentPage] = useState(0); 

    const [educationPage, setEducationPage] = useState(0);
    const educationsPerPage = 2;
    const totalEducationPages = useMemo(() => {
      if (!nanny?.educations) return 1;
      return Math.ceil(nanny.educations.length / educationsPerPage);
    }, [nanny]);
    
    const startEduIndex = educationPage * educationsPerPage;
    const visibleEducations = nanny?.educations
    ? nanny.educations.slice(startEduIndex, startEduIndex + educationsPerPage)
    : [];

    const handlePrevEdu = () => {
      setEducationPage((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextEdu = () => {
      setEducationPage((prev) => (prev < totalEducationPages - 1 ? prev + 1 : prev));
    };
  
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
    

    useEffect(() => {    
      axios.get(`/api/nanny-profiles/${id}`)
        .then((res) => {
          console.log("Профіль няні з API:", res.data); 
          setNanny(res.data);
        })
        .catch((err) => console.error("Помилка завантаження профілю няні:", err));
    }, [id]);
  
    if (!nanny) return <div>Завантаження...</div>;
        
    const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;
  
  const clients = nanny.total_clients || 100; // placeholder
  const hoursWorked = nanny.total_hours || 100; // placeholder
  const genderClass = nanny.gender === "female" ? "female" : "male";
  const isFavorite = favoriteIds.some((fav) => fav.nanny_id === nanny.id);
 
  const getCertificateLabel = (count) => {
    if (count === 1) return "документ";
    if (count >= 2 && count <= 4) return "документи";
    return "документів";
  }; 

  const getreReviewsLabel = (count) => {
    if (count === 1) return "відгук";
    if (count >= 2 && count <= 4) return "відгуки";
    return "відгуків";
  };
   
  const reviewsPerPage = 4;

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };
  const isValidPhoto =
  nanny.photo &&
  nanny.photo !== "null" &&
  nanny.photo.trim() !== "";

  const startIndex = currentPage * reviewsPerPage;
  const visibleReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

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
  
  
  return (
    <div>
        <VariantHeader />    
    <div className="nanny-public-profile">
        <button onClick={() => navigate(-1)} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
       
        {/* ЛІВИЙ СТОВПЕЦЬ */}
        <div className="left-column"> 
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
              isValidPhoto
                ? `${baseUrl}/storage/${nanny.photo}`
                : `${baseUrl}/storage/default-avatar.jpg`
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
            </div>
            <p className="title-text-nanny">Оплата за годину</p>
              <p style={{
                fontFamily: "'Comfortaa', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "120%",
                letterSpacing: "-2%",
                color: "#3A3B61",
                paddingLeft: "20px",
                paddingTop: "5px",
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

           {/* Виведення освіти */}
           {Array.isArray(nanny.educations) && nanny.educations.length > 0 ? (
            <div className="education-section">
              <div className="header-edu">
                <h3 className="edu-title">Освіта</h3>
                <p className="cert-count">
                  {nanny.educations.length} {getCertificateLabel(nanny.educations.length)}
                </p>
              </div>
              <div className="education-content"> 
              {visibleEducations.map((edu, idx) => (
                <div key={idx} className="education-card">
                  <h4 className="institution">{edu.institution}</h4>
                  <p className="specialty">{edu.specialty}</p>
                  <div className="document-info">
                    <div className="doc-text">
                      <span className="document-title">Документ:</span>
                      <span className="document-date">{edu.years}</span>
                    </div>
                    {edu.diploma_image && (
                    <div className="document-image-wrapper">
                      <img
                        src={`${baseUrl}/storage/${edu.diploma_image}`}
                        alt="Диплом"
                        className="document-image"
                      />
                      <button
                        className="view-diploma-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDiplomaPreviewUrl(`${baseUrl}/storage/${edu.diploma_image}`);
                        }}
                      >
                        <img src={eye} alt="Переглянути диплом" />
                      </button>
                    </div>
                  )}
                  {diplomaPreviewUrl && (
                    <div className="modal-overlay-dipl" onClick={closeModal}>
                      <div className="modal-content-dipl" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>✖</button>
                        <img
                          src={diplomaPreviewUrl}
                          alt="Диплом"
                          style={{ maxWidth: "100%", maxHeight: "80vh" }}
                        />
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              ))}
              </div>

              <div className="education-navigation">
              <button className="nav-arrow left" onClick={handlePrevEdu} disabled={educationPage === 0}>
                &#8592;
              </button>
              <span className="page-info">
                {startEduIndex + 1}–{Math.min(startEduIndex + educationsPerPage, nanny.educations.length)} з {nanny.educations.length} документів
              </span>
              <button className="nav-arrow right" onClick={handleNextEdu} disabled={educationPage === totalEducationPages - 1}>
                &#8594;
              </button>
              </div>
            </div>
          ) : (
            <div className="education-section empty-education">
              <div className="header-edu">
                <h3 className="edu-title">Освіта</h3>
                <p className="cert-count">0 документів</p>
              </div>                
              <BearPlaceholder />
            </div>
          )}
        </div>
  
        {/* ЦЕНТРАЛЬНИЙ СТОВПЕЦЬ */}
        <div className="center-column">       
            <div className="block">
            <p className="title-text-nanny-detail">Про мене</p>
            <p className="nanny-text"
          style={{
            maxHeight: isExpanded ? "none" : "132px", 
            overflow: "hidden", 
            transition: "max-height 0.3s ease" 
          }}
          >
            {nanny.about_me && nanny.about_me.trim().length > 0
              ? nanny.about_me
              : " — "}
          </p>
          <div className="button-container">
          <button
            className="read-next-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Згорнути" : "Читати далі"}
          </button>
          </div>
          </div>
  
          <div className="block">
            <p className="title-text-nanny-detail">Мови спілкування</p>
            <div className="tags-row">
              {nanny.languages?.map((item, idx) => <span key={idx} className="pill">{item}</span>)}
            </div>  
          </div>

          <div className="block">
            <p className="title-text-nanny-detail">Графік роботи</p>
            <div className="tags-row">
              {nanny.work_schedule?.map((item, idx) => <span key={idx} className="pill">{item}</span>)}
            </div>           
          </div>
            
          <div className="block">
            <p className="title-text-nanny-detail">Як проходить робота</p>
            <p className="nanny-text"
            style={{
              maxHeight: isExpanded ? "none" : "132px", 
              overflow: "hidden", 
              transition: "max-height 0.3s ease" 
            }}
            >
               {nanny.goat && nanny.goat.trim().length > 0
                  ? nanny.goat
                  : " — "}        
            </p>
            <div className="button-container">
            <button
              className="read-next-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Згорнути" : "Читати далі"}
            </button>
            </div>
          </div>
          
          <div className="block">
          <p className="title-text-nanny-detail">Напрями роботи</p>
            <div className="tags-row">
              {nanny.specialization?.map((item, idx) => <span key={idx} className="pill">{item}</span>)}
            </div>
            </div>
            
            <div className="block">
            <p className="title-text-nanny-detail">Додаткові навички</p>
            <div className="tags-row">
              {nanny.additional_skills?.map((item, idx) => <span key={idx} className="pill">{item}</span>)}
            </div>           
          </div>
          <div className="calendar-btn-wrapper">
          <button className="calendar-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/booking/${nanny.id}`);
            }}
          >
             <span className="icon-btn-calendar" /> Запланувати
          </button>
        </div>
        </div>
  
        {/* ПРАВИЙ СТОВПЕЦЬ */}
        <div className="right-column">
        {/* Відео секція */}
        <div className="video-section">
          <div className="video-wrapper">
            {nanny.video ? (
              <video width="417" height="740" style={{ borderRadius: "20px" }} controls>
                <source src={`${baseUrl}/storage/${nanny.video}`} type="video/mp4" />
                Ваш браузер не підтримує відео.
              </video>
            ) : (
              <div className="bear-placeholder-video">
                <BearPlaceholder />               
              </div>
            )}
          </div>
        </div>

        {/* Фото секція */}
        <div className="photo-section">
          <div className="photo-grid">
            {Array.isArray(nanny.gallery) && nanny.gallery.length > 0 ? (
              nanny.gallery.map((img, idx) => (
                <div key={idx} className="photo-item">
                  <img
                    src={`${baseUrl}/storage/${img}`}
                    alt={`Фото ${idx + 1}`}
                    className="photo-item-img"
                  />
                </div>
              ))
            ) : (
              <>
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="photo-item" />
              ))}
              <div className="bear-center-on-photos">
                <BearPlaceholder />
              </div>
            </>
            )}
          </div>
        </div>
      </div>          
      </div>
           
         {/* Відгуки секція */}
          <div className="reviews-section">
            <div className="review-header">
              <h3>Відгуки</h3>
              {reviews.length > 0 && (
                <div className="review-summary">
                  <span className="review-count">
                    {reviews.length} {getreReviewsLabel(reviews.length)}
                  </span>
                  <span className="review-average">
                  {averageRating.toFixed(1)}
                  <span className="stars">
                  {renderStars(averageRating, "avg")}
                  </span>
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
                          review.parent_profile?.photo
                            ? `${baseUrl}/storage/${review.parent_profile.photo}`
                            : `${baseUrl}/storage/default-avatar.jpg`
                        }
                        alt="Аватар"
                        className="review-avatar"
                      />
                    <div className="review-text">
                      <strong className="name-parent-rev">
                        {review.parent_profile?.first_name}{" "}
                        {review.parent_profile?.last_name?.charAt(0)}.
                      </strong>
                      <div className="stars">
                      {renderStars(review.rating, review.id || idx)}
                      </div>
                      <p className="coment-text">{review.comment}</p>
                    </div>
                    <div className="review-date">
                      {new Date(review.created_at).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bear-placeholder-reviews">
                  <BearPlaceholder />
                </div>
              )}
            </div>

            {/* Напис внизу */}
            {reviews.length > 0 && (
              <div className="review-footer">               
                <div className="review-navigation">
                <button className="nav-arrow left" onClick={handlePrev} disabled={currentPage === 0}>
                  &#8592;
                </button>
                <span className="page-info">
                  {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, reviews.length)} з {reviews.length} відгуків
                </span>
                <button className="nav-arrow right" onClick={handleNext} disabled={currentPage === totalPages - 1}>
                  &#8594;
                </button>
              </div>
              </div>
            )}
          </div>

        {/* Кнопка "Поскаржитись" */}
        <div className="complaint-button">
          <button className="report-profile-btn" onClick={() => navigate(`/report/${nanny.user_id}`)}>Поскаржитись на цей профіль</button>
        </div>
          <Footer/>
      </div>
    );
  };

export default NannyDetailPage;
