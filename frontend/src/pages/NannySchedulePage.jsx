import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScheduleDayView from "../components/Schedule/ScheduleDayView";
import ScheduleWeekView from "../components/Schedule/ScheduleWeekView";
import ScheduleMonthView from "../components/Schedule/ScheduleMonthView";
import BookingDetailModal from "../components/Modal/BookingDetailModal";
import VariantHeaderNanny from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";
import axios from "../axiosConfig";
import "../styles/schedule.css";

const NannySchedulePage = () => {
  const [viewMode, setViewMode] = useState("month");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const location = useLocation();
  const [activeDay, setActiveDay] = useState(null);


  useEffect(() => {
    axios
      .get("/api/nanny/bookings")
      .then((res) => {
        setBookings(res.data); // ✅ Очікується, що бекенд повертає start_time, end_time, date, parent
      })
      .catch((err) => console.error("❌ Помилка при завантаженні бронювань:", err));
  }, []);

  useEffect(() => {
    console.log("✅ NannySchedulePage loaded");
  }, []);
 
  useEffect(() => {
    if (location.state?.selectedDay) {
      setSelectedDay(location.state.selectedDay);
      setActiveDay(location.state.selectedDay); // 🟢 зберігаємо обраний день як активний
    }
    if (location.state?.view === "day") {
      setViewMode("day");
    }
  }, [location.state]);

  const renderView = () => {
    switch (viewMode) {
      case "day":
        return (
          <ScheduleDayView
            bookings={bookings}
            selectedDay={selectedDay}
            onBookingClick={setSelectedBooking}         
          />
        );
      case "week":
        return (
          <ScheduleWeekView
            bookings={bookings}
            onBookingClick={setSelectedBooking}
            activeDay={activeDay}
            onDaySelect={(day) => {
              setSelectedDay(day);
              setActiveDay(day); 
              setViewMode("day");
            }}
          />
        );
      case "month":
      default:
        return (
          <ScheduleMonthView
            bookings={bookings}
            onBookingClick={setSelectedBooking}
          />
        );
    }
  };
  

  return (
    <div>
      <VariantHeaderNanny />
      <div className="schedule-page">
      <div className="schedule-header">
      <button
        className={viewMode === "day" ? "active-tab" : ""}
        onClick={() => setViewMode("day")}
      >
        День
      </button>
      <button
        className={viewMode === "week" ? "active-tab" : ""}
        onClick={() => setViewMode("week")}
      >
        Тиждень
      </button>
      <button
        className={viewMode === "month" ? "active-tab" : ""}
        onClick={() => setViewMode("month")}
      >
        Місяць
      </button>
    </div>


        {renderView()}

        {selectedBooking && (
          <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NannySchedulePage;
