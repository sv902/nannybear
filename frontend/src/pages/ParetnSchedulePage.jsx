import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScheduleDayViewParent from "../components/Schedule/ScheduleDayViewParent";
import ScheduleWeekViewParent from "../components/Schedule/ScheduleWeekViewParent";
import ScheduleMonthViewParent from "../components/Schedule/ScheduleMonthViewParent";
import BookingDetailModal from "../components/Modal/BookingDetailModal";
import VariantHeder from "../components/Header/VariantHeader";
import Footer from "../components/Footer/Footer";
import axios from "../axiosConfig";
import "../styles/schedule.css";

const ParentSchedulePage = () => {
  const [viewMode, setViewMode] = useState("month");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const location = useLocation();
  const [activeDay, setActiveDay] = useState(null);


  useEffect(() => {
    axios
      .get("/api/parent/bookings")
      .then((res) => {
        setBookings(res.data); 
      })
      .catch((err) => console.error("❌ Помилка при завантаженні бронювань:", err));
  }, []);

  useEffect(() => {
    console.log("✅ ParentSchedulePage loaded");
  }, []);
 
  useEffect(() => {
    const state = location?.state;
    if (state?.selectedDay) {
      setSelectedDay(state.selectedDay);
      setActiveDay(state.selectedDay);
    }
    if (state?.view === "day") {
      setViewMode("day");
    }
  }, [location?.state]);  

  const renderView = () => {
    switch (viewMode) {
      case "day":
        return (
          <ScheduleDayViewParent
            bookings={bookings}
            selectedDay={selectedDay}
            onBookingClick={setSelectedBooking}         
          />
        );
      case "week":
        return (
          <ScheduleWeekViewParent
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
          <ScheduleMonthViewParent
            bookings={bookings}
            onBookingClick={setSelectedBooking}
          />
        );
    }
  };
  

  return (
    <div>
      <VariantHeder />
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

export default ParentSchedulePage;
