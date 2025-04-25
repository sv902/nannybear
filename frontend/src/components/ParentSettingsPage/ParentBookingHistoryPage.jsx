import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import Modal from "../../components/Modal/BookingDetailModal"; // новий компонент

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

const formatTime = (start, end) => {
  return `${start?.slice(0, 5)} - ${end?.slice(0, 5)}`;
};

const ParentBookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("УСІ");

  useEffect(() => {
    axios.get("/api/parent/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Помилка при завантаженні замовлень:", err));
  }, []);

  const filterBookings = (bookings) => {
    const now = new Date();
  
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
  
      if (activeFilter === "УСІ") return true;
  
      if (activeFilter === "ЦЕЙ ТИЖДЕНЬ") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      }
  
      if (activeFilter === "ЦЕЙ МІСЯЦЬ") {
        return (
          bookingDate.getMonth() === now.getMonth() &&
          bookingDate.getFullYear() === now.getFullYear()
        );
      }
  
      if (activeFilter === "ЦЬОГО РОКУ") {
        return bookingDate.getFullYear() === now.getFullYear();
      }
  
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
        {["УСІ", "ЦЕЙ ТИЖДЕНЬ", "ЦЕЙ МІСЯЦЬ", "ЦЬОГО РОКУ"].map((label) => (
          <button
            key={label}
            className={`filter-btn ${activeFilter === label ? "active" : ""}`}
            onClick={() => setActiveFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

        <div className="booking-cantainer">
          {filterBookings(bookings).map((booking, index) => (
            <div key={index} className="booking-card" onClick={() => setSelectedBooking(booking)}>
            
                <p className="booking-date">{formatDate(booking.date)}</p>
              <div className="booking-info">
                <img
                  src={
                    booking.nanny?.photo
                      ? `${baseUrl}/storage/${booking.nanny.photo}`
                      : `${baseUrl}/storage/default-avatar.jpg`
                  }
                  alt="Няня"
                  className="nanny-avatar"
                />               
                <div>
                  <p className="nanny-name-booking">
                    {booking.nanny?.first_name} <br /> {booking.nanny?.last_name}
                  </p>
                  <p className="booking-time">{formatTime(booking.start_time, booking.end_time)}</p>
                </div>
                <div className="booking-actions">             
                  <button className="menu-btn">⋯</button>
                </div>
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

export default ParentBookingHistoryPage;
