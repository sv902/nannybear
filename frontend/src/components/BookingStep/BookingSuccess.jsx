import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import axios from "../../axiosConfig";

const BookingSuccess = () => {  
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingId = state?.bookingId || localStorage.getItem("bookingId");
   const [nanny, setNanny] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (bookingData?.nanny?.id) {
      axios.get(`/api/nanny-profiles/${bookingData.nanny.id}`, { withCredentials: true })
        .then((res) => setNanny(res.data))
        .catch((err) => console.error("Помилка завантаження няні:", err));
    }
  }, [bookingData]);
  
  
  useEffect(() => {
    if (bookingId) {
      axios.get(`/api/bookings/${bookingId}`, { withCredentials: true })
        .then(res => setBookingData(res.data))
        .catch(err => console.error("❌ Помилка завантаження бронювання:", err));
    }
  }, [bookingId]);

  console.log("📦 bookingId із useLocation:", bookingId);

  useEffect(() => {
    if (bookingData?.nanny?.user_id) {
      axios.get(`/api/reviews/${bookingData.nanny.user_id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Помилка завантаження відгуків:", err));
    }
  }, [bookingData]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (!bookingData) return <LoadingScreen text="Завантаження сторінки..." />;

  // Після перевірки!
  const { address, payment_type, total_price, booking_days, hourly_rate } = bookingData;

  const parsedStart = new Date(booking_days[0].date);
  const parsedEnd = new Date(booking_days[booking_days.length - 1].date);
 const totalHours = booking_days.reduce((sum, d) => {
  if (!d.start_time || !d.end_time) return sum;
  const [sh, sm] = d.start_time.split(":").map(Number);
  const [eh, em] = d.end_time.split(":").map(Number);
  const diff = (eh * 60 + em - sh * 60 - sm) / 60;
  return sum + diff;
}, 0);


  const getTimeRangeFromBookingDays = () => {
    const times = booking_days.map(d => d.start_time).sort();
    const ends = booking_days.map(d => d.end_time).sort();
    return {
      earliest: times[0]?.slice(0, 5),
      latest: ends[ends.length - 1]?.slice(0, 5),
    };
  };

  const timeRange = getTimeRangeFromBookingDays();

  const paymentLabel = payment_type === "card"
  ? "Карткою"
  : payment_type === "cash"
  ? "Готівкою"
  : "—";


  if (!bookingData || !nanny) return <LoadingScreen text="Завантаження сторінки..." />;

  return (
    <div >
      <VariantHeader />
      <div className="container">
        <h1 className="success-title">ПЛАНУВАННЯ УСПІШНЕ!</h1>
        <p className="success-subtitle">Дякуємо, що користуєтеся нашими послугами!</p>
        <p className="success-text">
          Ми вдосконалюємо сервіс завдяки Вашим відгукам,<br />
          не забувайте їх писати!<br /><br />
          Сподіваємося, що ваша зустріч з нянею пройде якнайкраще.
        </p>

        <div className="nanny-info">
          <div className="nanny-profile-preview-edit-booking">
            <img
              src={nanny.photo}
              alt="Няня"
              className="nanny-booking-avatar-edit"
            />
            <div>
              <h2 className="nanny-booking-name">
                {nanny?.first_name} <br /> {nanny?.last_name}
              </h2>
              <div className="rating-stars-card-booking">
                {[1, 2, 3, 4, 5].map(i => {
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
          <span className="success-total-price">{total_price} грн</span>
        </div>

        <div className="booking-summary-bar">
          <div className="modal-strip">
            <div className="strip-item dark with-left-ear-booking">
              <div className="ear-booking left-ear-booking"></div>
              <p className="inf-text">Дата</p>
              <span className="inf-data-booking">
                {parsedStart.toDateString() === parsedEnd.toDateString()
                  ? parsedStart.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })
                  : `${parsedStart.toLocaleDateString("uk-UA", { day: "numeric", month: "2-digit", year: "numeric" })} – 
                     ${parsedEnd.toLocaleDateString("uk-UA", { day: "numeric", month: "2-digit", year: "numeric" })}`}
              </span>
            </div>

            <div className="strip-item pink">
              <p className="inf-text">{timeRange?.earliest} – {timeRange?.latest}</p>
              <span className="inf-data-booking">{totalHours} годин</span>
            </div>

            <div className="strip-item blue">
              <p className="inf-text">ОПЛАТА НЯНІ</p>
              <span className="inf-data-booking">{hourly_rate} грн / год.</span>
            </div>

            <div className="strip-item orange with-right-ear-booking">
              <div className="ear-booking right-ear-booking"></div>
              <p className="inf-text">Оплата</p>
              <span className="inf-data-booking">{paymentLabel}</span>
            </div>
          </div>
          <p className="text-confident">Припустили помилку? Ви можете повернутись назад та виправити будь-що!</p>
        </div>

        <br />
        <div className="modal-address">
          <h3>АДРЕСА</h3>
          <p>
            {address?.type}: {address?.city}, {address?.address}, {address?.floor} поверх, кв {address?.apartment}
          </p>
        </div>

        <button onClick={() => navigate("/all-nannies")} className="btn-return">
          Повернутись до списку нянь
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
