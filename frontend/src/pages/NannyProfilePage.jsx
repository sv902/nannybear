// src/pages/NannyProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import "../styles/nannydetail.css";
import "../styles/nannycard.css";
import "../styles/nannyProfile.css";
import eye from "../icons/eye.png";

import BearPlaceholder from "../components/BearPlaceholder/BearPlaceholder";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import locationIcon from "../assets/icons/location.svg";
import VariantNannyHeader from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";

const NannyProfilePage = () => {
    const [nanny, setNanny] = useState(null);   
    const { id, user_id } = useParams();
    const profileId = id || user_id;
    const navigate = useNavigate();   

    const [isExpanded, setIsExpanded] = useState(false); 
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    
    const [diplomaPreviewUrl, setDiplomaPreviewUrl] = useState(null);
    const closeModal = () => setDiplomaPreviewUrl(null); 
    const [reviews, setReviews] = useState([]);   

    const [currentPage, setCurrentPage] = useState(0);
     const [currentUser, setCurrentUser] = useState(null);
     const [educationPage, setEducationPage] = useState(0);

     useEffect(() => {
      axios.get("/api/user") 
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error("❌ Помилка при отриманні користувача:", err));
    }, []);

    useEffect(() => {
      axios.get(`/api/nanny-profiles/${profileId}`)
        .then((res) => {
          setNanny(res.data);
          console.log("Айді в NannyProfilePage:", profileId);
        })
        .catch((err) => {
          console.error("Помилка завантаження профілю няні:", err);
        });
    }, [profileId]);
    

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

    const [clients, setClients] = useState(0);
const [hoursWorked, setHoursWorked] = useState(0);

useEffect(() => {
  axios.get("/api/nanny/bookings")
    .then((res) => {
      const bookingDays = res.data.flatMap(b => b.booking_days || []);
      const uniqueClients = new Set(res.data.map(b => b.parent_id));
      setClients(uniqueClients.size);

      const totalHours = bookingDays.reduce((acc, day) => {
        const start = new Date(`1970-01-01T${day.start_time}`);
        const end = new Date(`1970-01-01T${day.end_time}`);
        return acc + (end - start) / 3600000;
      }, 0);
      setHoursWorked(totalHours);
    })
    .catch(err => {
      console.error("❌ Помилка при завантаженні бронювань:", err);
    });
}, []);

  
    if (!nanny) return <div>Завантаження...</div>;
        
    const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

    
  const genderClass = nanny.gender === "female" ? "female" : "male";
 

const educationsPerPage = 2;
const totalEducationPages = Math.ceil((nanny.educations?.length || 0) / educationsPerPage);

const startEduIndex = educationPage * educationsPerPage;
const visibleEducations = (nanny.educations || []).slice(startEduIndex, startEduIndex + educationsPerPage);

const handlePrevEdu = () => {
  setEducationPage((prev) => (prev > 0 ? prev - 1 : prev));
};

const handleNextEdu = () => {
  setEducationPage((prev) => (prev < totalEducationPages - 1 ? prev + 1 : prev));
};

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
        <VariantNannyHeader />   
        <div className="profile-header-nanny">     
          {currentUser?.id === nanny.user_id && (
            <div >
              <button onClick={() => navigate('/nanny/profile/edit')} className="edit-profile-btn">
                ✎ Редагувати профіль
              </button>
            </div>
          )}          
        </div> 
    <div className="nanny-edit-profile"> 
        {/* ЛІВИЙ СТОВПЕЦЬ */}
        <div className="left-column"> 
        <div className={`nanny-colom-color-prof ${genderClass}`}> 
        <div className="photo-wrapper">
          <img
            src={nanny.photo || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/nannies/default-avatar.jpg"}
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
   
        <div className="nanny-inf-container">
            <div className="bottom-details-row-nanny">
              <div className="left-info">
                <div >
                  <img src={briefcaseIcon} alt="досвід" className="icon-card" />
                  <span className="yers-city">{Math.floor(nanny.experience_years)}+ років </span>
                  <span className="yers-city-text">досвіду</span>
                </div>
                <div >
                  <img src={locationIcon} alt="локація" className="icon-card" />
                  <span className="yers-city">{nanny.city}, </span>
                  <span className="yers-city-text">{nanny.district}</span>
                </div>
              </div>              
            </div>
            <p className="match-text-nanny-prof">Оплата за годину</p>
              <p style={{
                fontFamily: "'Comfortaa', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "120%",
                letterSpacing: "-2%",
                color: "#3A3B61",               
                paddingTop: "5px",
                textAlign: "left",
              }}>
                середня оплата в місті Київ: 350 грн
              </p>
              <div className="rate">
                {Math.floor(nanny.hourly_rate)} ₴
              </div>             
            </div>   
            </div> 

           {/* Виведення освіти */}
           {Array.isArray(nanny.educations) && nanny.educations.length > 0 ? (
            <div className="education-section-prof">
              <div className="header-edu">
                <h3 className="edu-title">Освіта</h3>
                <p className="cert-count">
                  {nanny.educations.length} {getCertificateLabel(nanny.educations.length)}
                </p>
              </div>

              <div className="education-list-wrapper">
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
                         src={edu.diploma_image}
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
          
        </div>
  
        {/* ПРАВИЙ СТОВПЕЦЬ */}
        <div className="right-column-nanny">
        {/* Відео секція */}
        <div className="video-section">
          <div className="video-wrapper">
            {nanny.video ? (
              <video width="417" height="740" style={{ borderRadius: "20px" }} controls>
                <source src={nanny.video} type="video/mp4" />
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
                    src={img}
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
          <div className="reviews-section-nanny">
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
                          review.parent_profile?.photo?.startsWith("http")
                            ? review.parent_profile.photo
                            : `${baseUrl}/storage/${review.parent_profile?.photo || "default-avatar.jpg"}`
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
        
          <Footer/>
      </div>
    );
  };

export default NannyProfilePage;
