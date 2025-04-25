import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import Modal from "../../components/Modal/BookingDetailModalNanny"; // окремий модал

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("uk-UA", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatTime = (start, end) => `${start?.slice(0, 5)} - ${end?.slice(0, 5)}`;

const NannyBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState("УСІ");
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/nanny/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Помилка при завантаженні:", err));
  }, []);

  const filterBookings = (bookings) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const date = new Date(booking.date);
      if (activeFilter === "УСІ") return true;
      if (activeFilter === "ЦЕЙ ТИЖДЕНЬ") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay() + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return date >= start && date <= end;
      }
      if (activeFilter === "ЦЕЙ МІСЯЦЬ") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      if (activeFilter === "ЦЬОГО РОКУ") return date.getFullYear() === now.getFullYear();
      return true;
    });
  };

  return (
    <div>
      <VariantHeader />
      <div className="edit-page-container">
        <button onClick={() => navigate(-1)} className="back-button-dark">
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>
        <h1 className="settings-title-pag">Історія зустрічей</h1>

        <div className="filter-buttons">
          {["УСІ", "ЦЕЙ ТИЖДЕНЬ", "ЦЕЙ МІСЯЦЬ", "ЦЬОГО РОКУ"].map(label => (
            <button key={label} className={`filter-btn ${activeFilter === label ? "active" : ""}`} onClick={() => setActiveFilter(label)}>
              {label}
            </button>
          ))}
        </div>

        <div className="booking-cantainer">
          {filterBookings(bookings).map((booking, i) => (
            <div key={i} className="booking-card" onClick={() => setSelectedBooking(booking)}>
              <p className="booking-date">{formatDate(booking.date)}</p>
              <div className="booking-info">
                <img
                 src={booking.parent?.photo ? `${baseUrl}/storage/${booking.parent.photo}` : `${baseUrl}/storage/default-avatar.jpg`}
                  alt="Батько"
                  className="nanny-avatar"
                />
                <div>
                  <p className="nanny-name-booking">{booking.parent?.first_name} <br /> {booking.parent?.last_name}</p>
                  <p className="booking-time">{formatTime(booking.start_time, booking.end_time)}</p>
                </div>
                <div className="booking-actions"><button className="menu-btn">⋯</button></div>
              </div>
            </div>
          ))}
        </div>

        {selectedBooking && (
          <Modal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NannyBookingHistoryPage;
