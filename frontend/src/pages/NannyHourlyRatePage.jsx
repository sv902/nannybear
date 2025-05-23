import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import VariantHeaderNanny from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";
import "../styles/nannyHourlyRatePage.css";
import briefcaseIcon from "../assets/icons/briefcase.svg";
import locationIcon from "../assets/icons/location.svg";
import SalarySavedModal from "../components/Modal/SalarySavedModal";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const NannyHourlyRatePage = () => {    
  const navigate = useNavigate();
  const [rate, setRate] = useState(0);
  const [newRate, setNewRate] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [nanny, setNanny] = useState(null);
 const [reviews, setReviews] = useState([]); 
  const [, setCurrentUser] = useState(null);
  const [showSavedModal, setShowSavedModal] = useState(false);


  useEffect(() => {
    axios.get("/api/user") 
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("❌ Помилка при отриманні користувача:", err));
  }, []);
  
  const [clients, setClients] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  
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
    axios.get("/api/nanny/profile").then(res => {
      const profile = res.data.profile;
      const cleanedRate = parseFloat(
        (profile.hourly_rate || "0").toString().replace(",", ".")
      );
      setRate(cleanedRate);
      setNewRate(cleanedRate);
      setNanny(profile);
    });
  
    axios.get("/api/nanny/bookings").then(res => {
      const bookingDays = res.data.flatMap(b => b.booking_days || []);
      setBookings(res.data.length);
      
      // Унікальні клієнти
      const uniqueClients = new Set(res.data.map(b => b.parent_id));
      setClients(uniqueClients.size);
      
      // Загальні години
      const totalHours = bookingDays.reduce((acc, day) => {
        const start = new Date(`1970-01-01T${day.start_time}`);
        const end = new Date(`1970-01-01T${day.end_time}`);
        return acc + (end - start) / 3600000;
      }, 0);
      setHoursWorked(totalHours);
      
      // Загальний заробіток з урахуванням ставки бронювання
      const total = res.data.reduce((acc, booking) => {
        const hours = booking.booking_days?.reduce((sum, day) => {
          const start = new Date(`1970-01-01T${day.start_time}`);
          const end = new Date(`1970-01-01T${day.end_time}`);
          return sum + (end - start) / 3600000;
        }, 0) ?? 0;
      
        return acc + (hours * booking.hourly_rate);
      }, 0);
      setTotalEarnings(total);
      
    });
  }, [rate]);
  
  const handleSubmit = async () => {
    try {
      await axios.put("/api/nanny/profile/hourly-rate", {
        hourly_rate: newRate,
      });
      setRate(Number(newRate));
      setShowSavedModal(true); 
    } catch (err) {
      alert("Помилка при оновленні ставки");
    }
  };
  

  const averageRating = reviews.length
  ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  : 0;

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
  if (!nanny || !nanny.photo_url) return <LoadingScreen text="Завантаження профілю няні..." />;

  const genderClass = nanny.gender === "female" ? "female" : "male";
  // const clients = nanny.total_clients ?? 100; // placeholder
  // const hoursWorked = nanny.total_hours ?? 100; // placeholder

  return (
    <div>
        <VariantHeaderNanny />
    <div className="nanny-income-page">     
     <div className="nanny-income-card">
      <div className={`nanny-colom-color-prof ${genderClass}`}> 
              <div className="photo-wrapper">
                <img
                  src={
                    nanny.photo_url
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
        <p className="text-nanny-income">*Ми отримуємо 20% комісії з кожного бронювання. 
                    <br/> <br/> 
        Ці кошти йдуть на підтримку сервісу, перевірку профілів, розвиток функцій 
        та підтримку користувачів</p>
    </div>

        <div className="block-two">            
      <div className="nanny-stats">
        <div className="stat-card orange">
          <div className="stat-card-orange">
          <p>БАЛАНС*</p>
          <h2>{Math.round(totalEarnings).toLocaleString()} ГРН</h2> 
          </div>
          <button>ВИВЕСТИ ГРОШІ</button>         
        </div>
       

        <div className="stat-card green">
          <div className="stat-card-green">
          <p>БРОНЮВАНЬ</p>
          <h2>
            {(bookings)} 
            {(bookings) === 1 
              ? " ЗУСТРІЧ" 
              : (bookings) <= 4 
              ? " ЗУСТРІЧІ" 
              : " ЗУСТРІЧЕЙ"}
          </h2>
          </div>
          <button onClick={() => navigate("/nanny-booking-stats")}>
            СТАТИСТИКА
          </button>
        </div>
      </div>

      <div className="rate-section">
        <h2>ОПЛАТА ЗА ГОДИНУ*</h2>
        <div className="rate-container">
        <div className="rate-input-wrapper">
          <input
            type="number"
            className="rate-input"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            placeholder="0"
          />
          <span className="currency">ГРН</span>
        </div>
        <button className="save-button-rate" onClick={handleSubmit}>
          ЗБЕРЕГТИ ЗМІНИ
        </button>
        </div>
      </div>
      </div>
    </div>
     <Footer />

      {showSavedModal && (
        <SalarySavedModal onClose={() => setShowSavedModal(false)} />
      )}
     </div>
  );
};

export default NannyHourlyRatePage;
