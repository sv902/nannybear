import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const BookingStep4 = () => { 
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [nanny, setNanny] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [selectedPayment, setSelectedPayment] = useState(null);
  // const [workingHours, setWorkingHours] = useState([]);
 
  const { startDate, endDate, hourlyRate, address, booking_days } = location.state || {};

  useEffect(() => {
    
    axios.get(`/api/nanny-profiles/${id}`, { withCredentials: true })
      .then((res) => setNanny(res.data))
      .catch((err) => console.error("Помилка завантаження няні:", err));
  }, [id]);

  useEffect(() => {
    if (nanny?.user_id) {
      axios.get(`/api/reviews/${nanny.user_id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Помилка завантаження відгуків:", err));
    }
  }, [nanny]);

  // useEffect(() => {
  //   axios.get(`/api/nanny-working-hours/${id}`, { withCredentials: true })
  //     .then(res => {
  //       console.log("Графік няні:", res.data); // Перевір у консолі
  //       setWorkingHours(res.data); // або res.data.working_hours
  //     })
  //     .catch(err => console.error("❌ Помилка завантаження графіка:", err));
  // }, [id]);
  

 const calculateTotalBookingHours = () => {
  if (!Array.isArray(booking_days)) return 0;

const getHourDiff = (start, end) => {
  if (!start || !end || !start.includes(":") || !end.includes(":")) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - sh * 60 - sm) / 60;
};


  return booking_days.reduce((sum, d) => {
    if (d.start_time && d.end_time) {
      return sum + getHourDiff(d.start_time, d.end_time);
    }
    return sum;
  }, 0);
};
     
  const totalHoursDynamic = calculateTotalBookingHours();
  const totalPrice = hourlyRate * totalHoursDynamic;  

  const averageRating = reviews.length > 0
  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  : "—";

  const handleSubmit = () => {
    if (!selectedPayment) {
      alert("Оберіть метод оплати");
      return;
    }
  
    const normalizeTime = (timeStr) => {
  return timeStr?.length === 5 ? timeStr + ":00" : timeStr;
};

const finalBookingDays = booking_days?.filter(
  (d) => d.date && d.start_time && d.end_time
).map((d) => ({
  ...d,
  start_time: normalizeTime(d.start_time),
  end_time: normalizeTime(d.end_time),
}));
 
  
  
      console.log("Дані для бронювання:", {
        nanny_id: Number(id),
        address_id: address.id,
        payment_type: selectedPayment,
        booking_days,
      });
      
      console.log("Приклад дня:", booking_days[0])

    axios.post("/api/check-booking-exists", {
      nanny_id: Number(id),
      address_id: address.id,
      booking_days,
    }, { withCredentials: true })
      .then(res => {
        if (res.data.exists) {
          alert("❌ Таке бронювання вже існує!");
          return;
        }
      
        axios.post("/api/bookings", {
          nanny_id: Number(id),
          address_id: address.id,
          payment_type: selectedPayment,
          booking_days: finalBookingDays,
        }, { withCredentials: true })
        .then((res) => {
          localStorage.setItem("bookingId", res.data.booking.id); // тут з'явиться booking
          navigate("/booking/success", { state: { bookingId: res.data.booking.id } });
        })        
        
       .catch(err => {
  const errorData = err.response?.data;

  if (err.response?.status === 422) {
    if (errorData?.errors) {
      console.error("❌ Валідація не пройдена:", errorData.errors);
    } else if (errorData?.error) {
      console.error("❌ Помилка валідації:", errorData.error);
      alert(errorData.error);
    } else {
      console.error("❌ Невідома помилка 422:", errorData);
    }
  } else {
    console.error("🔴 Інша помилка:", errorData || err.message);
    alert("Помилка створення бронювання.");
  }
});

        
      })
      .catch(err => {
        if (err.response?.status === 422) {
          console.error("❌ Помилка валідації:", err.response.data.errors ?? err.response.data);
          alert("Будь ласка, перевірте поля або графік няні.");
        } else {
          console.error("🔴 Інша помилка:", err);
          alert("Помилка створення бронювання.");
        }
      });           
  };
  
const getTimeRangeFromBookingDays = () => {
  if (!Array.isArray(booking_days) || booking_days.length === 0) return null;

  const startTimes = booking_days.map(d => d.start_time).sort();
  const endTimes = booking_days.map(d => d.end_time).sort();

  return {
    earliest: startTimes[0]?.slice(0, 5),
    latest: endTimes[endTimes.length - 1]?.slice(0, 5),
  };
};



    const formatDateperiod = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year} р.`;
  };

  if (!nanny) return <LoadingScreen text="Завантаження сторінки..." />;
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
            <span className="step-indicator">Крок 4/4</span>
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
              <h2 className="nanny-booking-name">{nanny.first_name} <br /> {nanny.last_name}</h2>
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
          <h2 className="booking-subtitle">Деталі бронювання</h2>
          <p className="booking-description">перевірте деталі бронювання</p>
        </div>

        <div className="booking-summary-bar">
        <div className="modal-strip">
          <div className="strip-item dark with-left-ear-booking">
          <div className="ear-booking left-ear-booking"></div>
          <p className="inf-text">
            {startDate === endDate ? "ДАТА" : "ПЕРІОД"}
          </p>
          <span className="inf-data-booking">
            {startDate === endDate
              ? new Date(startDate).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })
              : `${formatDateperiod(startDate)} – ${formatDateperiod(endDate)}`}
          </span>

          </div>

          <div className="strip-item pink">
           <p className="inf-text">
  {getTimeRangeFromBookingDays()?.earliest} – {getTimeRangeFromBookingDays()?.latest}
</p>

            <span className="inf-data-booking">
              {calculateTotalBookingHours()} годин
            </span>
          </div>


          <div className="strip-item blue">
            <p className="inf-text">ОПЛАТА НЯНІ</p>
            <span className="inf-data-booking">{hourlyRate} грн / год.</span>
          </div>

          <div className="strip-item orange with-right-ear-booking">
            <div className="ear-booking right-ear-booking"></div>
            <p className="inf-text">До сплати</p>
            <span className="inf-data-booking">{totalPrice} грн</span>
          </div>
        </div>
        <p className="text-confident">Припустили помилку? Ви можете повернутись назад та виправити будь-що!</p>
        </div>
          <br/>     
        <div className="modal-address">
          <h3>АДРЕСА</h3>
          <p>
            {address?.type}: {address?.city}, {address?.address}, {address?.floor} поверх, кв {address?.apartment}
          </p>
        </div>

        <div className="booking-subtitle-row">
          <h2 className="booking-subtitle">Оплата</h2>
          <p className="booking-description">оберіть зручний спосіб оплати</p>
        </div>
        <div className="payment-section">           
            <div className="payment-options">
              <div
                className={`payment-card ${selectedPayment === "card" ? "active" : ""}`}
                onClick={() => setSelectedPayment("card")}
              >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === "card"}
                    onChange={() => setSelectedPayment("card")}
                    className="payment-radio"
                  />
                <h4>КАРТКОЮ</h4>
                <div className="payment-amount">
                  <span>ДО СПЛАТИ</span>
                  <p className="payment-amount-total">{totalPrice} ГРН</p>
                  <p className="text-card-payment-amount">Ми цінуємо вашу довіру й суворо дотримуємося принципів конфіденційності — ваші особисті дані не передаються стороннім особам.</p>
                </div>
              </div>

              <div
                className={`payment-card ${selectedPayment === "cash" ? "active" : ""}`}
                onClick={() => setSelectedPayment("cash")}
              >
                 <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={selectedPayment === "cash"}
                  onChange={() => setSelectedPayment("cash")}
                  className="payment-radio"
                />
                <h4>ГОТІВКОЮ</h4>
                <div className="payment-amount">
                  <span>ДО СПЛАТИ</span>
                  <p className="payment-amount-total">{totalPrice} ГРН</p>
                  <p className="text-card-payment-amount">Оплата готівкою здійснюється перед наданням послуги. Обираючи цей спосіб розрахунку, ви зобов’язані повністю сплатити узгоджену суму няні.</p>
                </div>
              </div>
            </div>

            <button className="next-button-booking" onClick={handleSubmit}>СПЛАТИТИ</button>
          </div>

      </div>
      <Footer />
    </div>
  );
};

export default BookingStep4;
