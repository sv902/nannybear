import React, { useEffect, useState  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VariantHeader from "../components/Header/VariantHeader";
import Footer from "../components/Footer/Footer";
import axios from "../axiosConfig";
import ThankYouNannyModal from "../components/Modal/ThankYouNannyModal";
import "../styles/review.css";
import locationIcon from "../assets/icons/location.svg";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const AddParentReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;  
  const [parentProfile, setParentProfile] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
   

    const parent = booking?.parent;   

  const parentPhoto = parent?.photo_url;
    const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false);

    useEffect(() => {
      axios.get(`/api/parent-profiles/${parent.id}`)
        .then((res) => {
          setParentProfile(res.data);
        })
        .catch((err) => {
          console.error("❌ Помилка при завантаженні профілю:", err);
        });
    }, [parent.id]);
    
    console.log("Батько:", parent);
    console.log("Батько:", parentProfile);
    console.log("User всередині parent:", parent?.user);
       
    const mainAddress = parentProfile?.addresses?.[0];

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await axios.get(`/api/reviews/about-parent/${parent.user.id}`);
            setReviews(response.data);
      
            if (response.data.length > 0) {
              const avg = response.data.reduce((sum, r) => sum + r.rating, 0) / response.data.length;
              setAverageRating(avg.toFixed(1));
            }
          } catch (err) {
            console.error("Помилка при завантаженні рейтингу:", err);
          }
        };
      
        if (parent?.user?.id) {
          fetchReviews();
        }
      }, [parent]);
    
      useEffect(() => {
        const checkIfAlreadyReviewed = async () => {
          try {
            const res = await axios.get(`/api/reviews/about-parent/${parent.user.id}`);
            const alreadyReviewed = res.data.some(
              (r) => r.nanny_profile_id === booking.nanny.id
            );
            if (alreadyReviewed) {
              setShowAlreadyReviewedModal(true);
            }
          } catch (err) {
            console.error("Помилка перевірки наявного відгуку:", err);
          }
        };
      
        if (booking?.nanny?.id && parent?.user?.id) {
          checkIfAlreadyReviewed();
        }
    }, [parent, booking?.nanny?.id]);    

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
   
    try {
        await axios.post("/api/parent-reviews", {
          parent_profile_id: parent.id,
          rating,
          comment,
          is_anonymous: isAnonymous,
        });
      
        setError("");
        setShowModal(true);
      } catch (err) {
        if (err.response?.status === 400) {
          setShowAlreadyReviewedModal(true);
        } else {
          setError("Не вдалося надіслати відгук. Спробуйте ще раз.");
        }
      }      
  };

  const renderStars = (ratingValue, uniqueKey = "") => {
    return [1, 2, 3, 4, 5].map((index) => {
      const fillLevel = Math.min(Math.max(ratingValue - index + 1, 0), 1);
      const gradientId = `starGradient-${uniqueKey}-${index}`;
      return (
        <div className="star-wrapper-det" key={index}>
          <svg viewBox="0 0 20 20" className="star" xmlns="http://www.w3.org/2000/svg">
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

  if (!parent) return <LoadingScreen text="Завантаження сторінки..." />;

  return (
    <div>
      <VariantHeader />
      <div className="review-page-container">
        <button className="back-button-dark" onClick={() => navigate(-1)}>
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="review-page-title">ЗАЛИШИТИ ВІДГУК</h1>

        <div className="review-content">
          {/* LEFT BLOCK */}
          <div className="nanny-colom-color">
            <div className="photo-wrapper">
              <img src={parentPhoto} alt="Фото батька" className="nanny-photo-large" />
            </div>

            <div className="rating-stars">{renderStars(averageRating || 0, "avg")}</div>

            <div className="text-name-nanny">
              <h1>{parent.first_name} {parent.last_name}</h1>
            </div>

            <div className="location">
              <img src={locationIcon} alt="Локація" className="icon-card" />
              <span className="yers-city">
                {mainAddress?.city || "Місто не вказано"},{" "}
              </span>
              <span className="yers-city-text">
                {mainAddress?.district || "район не вказано"}
              </span>
            </div>

            <div className="actions-nanny">
              <button
                className="chat-btn-nanny-det"
                onClick={() => navigate(`/chat/${parent.id}`)}
              >
                <span className="icon-btn-chat" /> Чат
              </button>
            </div>
          </div>

          {/* RIGHT BLOCK */}
          <div className="review-form-block">
            <div className="star-container">
              <h2 className="review-subtitle">Зірочки для батьків:</h2>
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
              </div>
            </div>

            <h3 className="review-comment-label">НАПИШІТЬ КОМЕНТАР</h3>

            <div className="textarea-wrapper">
              <textarea
                placeholder="Поділіться враженнями про зустріч із батьками. Ваш відгук допоможе іншим няням приймати зважені рішення..."
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

            {error && <p className="error-text">{error}</p>}
            {showModal && (
            <ThankYouNannyModal onClose={() => navigate("/nanny/profile/edit/history")} />
            )}
          </div>
        </div>
      </div>
      <Footer />

      {showAlreadyReviewedModal && (
        <div className="error-overlay">
            <div className="error-modal">
            <button className="modal-close-err" onClick={() => setShowAlreadyReviewedModal(false)}>✖</button>
            <h2>Помилка!</h2>
            <p>Ми вже отримали Ваш відгук.</p>
            <p>Дякуємо, що ділитеся своєю думкою!</p>
            <button className="error-modal-btn-ok" onClick={() => navigate("/nanny/profile/edit/history")}>Добре</button>
            </div>
        </div>
        )}

    </div>
  );
};

export default AddParentReviewPage;
