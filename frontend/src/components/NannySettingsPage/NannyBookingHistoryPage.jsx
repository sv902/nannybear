import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import VariantHeaderNanny from "../../components/Header/VariantHeaderNanny";
import Footer from "../../components/Footer/Footer";
import "../../styles/settings.css";
import Modal from "../../components/Modal/BookingDetailModalNanny"; // окремий модал


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
      const date = new Date(booking.start_date);
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
      <VariantHeaderNanny />
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
          <div className="booking-card-cantainer">
          {filterBookings(bookings)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((booking, i) => (
            <div key={i} className="booking-card" onClick={() => setSelectedBooking(booking)}>

              <p className="booking-date">               
                  {booking.start_date === booking.end_date
                  ? `${new Date(booking.start_date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long"
                    })}`
                  : `${new Date(booking.start_date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long"
                    })} – ${new Date(booking.end_date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long"
                    })}`
                }
              </p>

              <div className="booking-info">
                <img
                 src={booking.parent?.photo ? `${baseUrl}/storage/${booking.parent.photo}` : `${baseUrl}/storage/default-avatar.jpg`}
                  alt="Батько"
                  className="nanny-avatar"
                />
                <div>
                  <p className="nanny-name-booking">{booking.parent?.first_name} <br /> {booking.parent?.last_name}</p>
                  {(() => {
                const uniqueDates = Array.from(new Set(booking.booking_days?.map(d => d.date)));
                if (uniqueDates.length === 1) {
                  const sortedStarts = [...booking.booking_days].map(t => t.start_time).sort();
                  const sortedEnds = [...booking.booking_days].map(t => t.end_time).sort();
                  return (
                    <p className="booking-time-mini">
                   {sortedStarts[0].slice(0, 5)} – {sortedEnds[sortedEnds.length - 1].slice(0, 5)}
                    </p>
                  );
                } else {
                  return (
                    <p className="booking-time-mini">
                      {uniqueDates.length} дн.
                    </p>
                  );
                }
              })()}
                </div>
                <div className="booking-actions"><button className="menu-btn">⋯</button></div>
              </div>
            </div>
          ))} </div>
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
