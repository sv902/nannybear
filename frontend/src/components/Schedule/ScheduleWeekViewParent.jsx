// src/components/Schedule/ScheduleWeekView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import BookingDetailModalParentCalendar from "../Modal/BookingDetailModalParentCalendar";
import "../../styles/schedule.css";

const weekDayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

const ScheduleWeekViewParent = ({ activeDay, onDaySelect }) => {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [workingHoursByDate] = useState({});
  const today = new Date();
  const [activeDayKey, setActiveDayKey] = useState(null);
    const [, setActivatedDates] = useState({});

  useEffect(() => {
    axios.get("/api/parent/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Помилка завантаження бронювань:", err));
  }, []);


  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  

  const bookingsMap = {};

    bookings.forEach((booking) => {
    if (!booking?.start_date || !booking?.end_date) return;

    const period = new Date(booking.start_date);
    const end = new Date(booking.end_date);

    while (period <= end) {
      const dateKey = formatDateKey(period);
      if (!bookingsMap[dateKey]) bookingsMap[dateKey] = [];

      bookingsMap[dateKey].push({
        ...booking,
        booking_days: booking.booking_days ?? [], // 🛡️ гарантує, що є масив
      });

      period.setDate(period.getDate() + 1);
    }
  });


  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  };

  const endOfWeek = getEndOfWeek(currentDate);
   
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const openBookingModal = (dateKey, clickedBooking = null) => {
    setActivatedDates(prev => ({ ...prev, [dateKey]: true }));
  
    const bookingsForDate = bookingsMap[dateKey] || [];
    const enriched = bookingsForDate.map(b => {
      const day = b.booking_days?.find(d => d.date === dateKey);
      return {
        ...b,
        date: dateKey,
        start_time: day?.start_time || b.start_time,
        end_time: day?.end_time || b.end_time,
        booking_days: b.booking_days || [],
      };
    });
    
    setSelectedBookings(enriched);
    
  
    if (clickedBooking) {
      const index = enriched.findIndex(b => b.id === clickedBooking.id);
      setSelectedIndex(index >= 0 ? index : 0);
    } else {
      setSelectedIndex(0);
    }
    
  };
  

  const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  const getSelectedHoursFromRanges = (ranges) => {
    if (!Array.isArray(ranges)) return [];
  
    const hours = new Set();
  
    ranges.forEach(range => {
      let startHour, endHour;
  
      if (typeof range === "string" && range.includes(" - ")) {
        const [start, end] = range.split(" - ");
        startHour = parseInt(start.slice(0, 2));
        endHour = parseInt(end.slice(0, 2));
      }
  
      if (typeof range === "object" && range.start_time && range.end_time) {
        startHour = parseInt(range.start_time.slice(0, 2));
        endHour = parseInt(range.end_time.slice(0, 2));
      }
  
      for (let h = startHour; h <= endHour; h++) {
        const hStr = `${h.toString().padStart(2, "0")}:00`;
        if (HOURS.includes(hStr)) {
          hours.add(hStr);
        }
      }
    });
  
    return Array.from(hours);
  };
     

  return (
    <div className="edit-page-container">
      <button onClick={() => navigate(-1)} className="back-button-dark">
        <span className="back-text">НАЗАД</span>
        <span className="back-arrow-dark"></span>
      </button>

      <div className="schedule-layout">
      <div className="left-sidebar">
          <h2 className="schedule-subtitle-left">Зустрічі на тижні</h2>
          {bookings
            .filter((booking) => {
              if (!booking?.start_date || !booking?.end_date) return false;

              const bookingStart = new Date(booking.start_date);
              const bookingEnd = new Date(booking.end_date);

              return bookingEnd >= startOfWeek && bookingStart <= endOfWeek;
            })
            .map((booking) => (
              <div key={booking.id} className="booking-wrapper">
              <p className="booking-time">
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

              {booking.nanny?.user_id && (
                <div
                  className="dots-button"
                  onClick={() => {
                    const fallbackDate = booking.booking_days?.[0]?.date || booking.start_date || booking.date;
                    openBookingModal(fallbackDate, {
                      ...booking,
                      date: fallbackDate,
                      start_time: booking.booking_days?.[0]?.start_time || booking.start_time,
                      end_time: booking.booking_days?.[0]?.end_time || booking.end_time,
                      booking_days: booking.booking_days ?? [],
                    });
                  }}
                >
                  ...
                </div>
              )}

                <div className="booking-card-mini" onClick={() => {
                  const fallbackDate = booking.booking_days?.[0]?.date || booking.start_date || booking.date;
                  openBookingModal(fallbackDate, {
                    ...booking,
                    date: fallbackDate,
                    start_time: booking.booking_days?.[0]?.start_time || booking.start_time,
                    end_time: booking.booking_days?.[0]?.end_time || booking.end_time,
                    booking_days: booking.booking_days ?? [],
                  });
                }}>
                <img
                  src={booking.nanny?.photo
                    || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                  alt="Батько"
                  className="mini-avatar"
                />
                <div className="booking-mini-info">
              <p className="booking-name-mini">
                {booking.nanny?.first_name} {booking.nanny?.last_name}
              </p>

              {(() => {
                const uniqueDates = Array.from(new Set(booking.booking_days?.map(d => d.date)));
                if (uniqueDates.length === 1) {
                  const sortedStarts = [...(booking.booking_days || [])].map(t => t.start_time).sort();
                  const sortedEnds = [...(booking.booking_days || [])].map(t => t.end_time).sort();
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
              </div>
            </div>
            ))}
        </div>

        <div className="calendar-column">
          <div className="calendar-header">
            <button onClick={goToPreviousWeek} className="month-nav">←</button>
            <h1 className="title-calendar">
              {startOfWeek.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })} – {days[6].toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
            </h1>
            <button onClick={goToNextWeek} className="month-nav">→</button>
          </div>

          <div className="weekdays-header">
            {days.map((day, idx) => (
              <div key={idx} className="weekday-cell">
                <div className="weekday-name">{weekDayNames[idx]}</div>
              </div>
            ))}
          </div>

          <div className="week-grid">
            {days.map((day, dayIndex) => {
              const dateKey = formatDateKey(day);
              const dayBookings = bookingsMap[dateKey] || [];
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isPastDate = new Date(day.toDateString()) < new Date(today.toDateString());
              return (
                <div
                  key={dayIndex}
                  className={`day-column-with-hours ${isPastDate ? "past" : ""} ${activeDayKey === dateKey ? "active-day-column" : ""}`}                  onClick={() => {
                    setActiveDayKey(formatDateKey(day));
                    onDaySelect(day.toISOString().split("T")[0]);
                    navigate("/parent-schedule", {
                      state: { selectedDay: day.toISOString().split("T")[0], view: "day" }
                    });
                  }}                  
                >             
                  <div className="top-row">
                  {isCurrentMonth && !isPastDate ? (
                      (bookingsMap[dateKey]?.length > 0) ? (
                        <button
                          className="edit-hour-button"
                          onClick={() => {
                            const dateBookings = bookingsMap[dateKey] || [];
                          
                            if (dateBookings.length > 0) {
                              openBookingModal(dateKey, {
                                ...dateBookings[0], // або зроби вибір розумно
                                date: dateKey,
                                start_time: dateBookings[0]?.booking_days?.[0]?.start_time || dateBookings[0]?.start_time,
                                end_time: dateBookings[0]?.booking_days?.[0]?.end_time || dateBookings[0]?.end_time,
                                booking_days: dateBookings[0]?.booking_days ?? [],
                              });
                            }
                          }}
                          title="Редагувати зустріч"
                        >
                          <img
                            src="/assets/edit-icon.svg"
                            alt="Редагувати"
                            className="edit-icon-image"
                          />
                        </button>
                      ) :(
                      <div style={{ width: "24px" }}></div>
                    ) 
                  ) : null}

                    <div className="cell-date">{day.getDate()}</div>
                  </div>
                      
                  {(() => {
                    const selectedHoursSet = new Set(getSelectedHoursFromRanges(workingHoursByDate[dateKey] || []));

                    return Array.from({ length: 25 }, (_, hour) => {
                      const hourStr = `${hour.toString().padStart(2, "0")}:00`;
                      const booking = dayBookings.find(b =>
                        b.booking_days?.some(d =>
                          d.date === dateKey &&
                          parseInt(d.start_time.slice(0, 2)) <= hour &&
                          parseInt(d.end_time.slice(0, 2)) >= hour
                        )
                      );
                                            
                      return (
                        
                        <div key={hour} className={`hour-slot ${booking ? "booked" : "free"}`}>
                          <span className={`hour-label ${selectedHoursSet.has(hourStr) ? "selected-hour" : ""}`}>
                            {hourStr}
                          </span>

                          {booking && (() => {
                          const day = booking.booking_days?.find(d => d.date === dateKey);
                          const bookingStartHour = parseInt(day?.start_time?.slice(0, 2) || booking.start_time?.slice(0, 2));
                          const bookingEndHour = parseInt(day?.end_time?.slice(0, 2) || booking.end_time?.slice(0, 2));

                          const isBlockStart = hour === bookingStartHour;

                          const hourHeight = 65; 
                        const blockHeight = (bookingEndHour - bookingStartHour) * hourHeight;

                        return isBlockStart && (
                          <div
                            className="booking-block"
                            style={{ top: 0, height: `${blockHeight}px` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingModal(dateKey, {
                                ...booking,
                                date: dateKey,
                                start_time: day?.start_time || booking.start_time,
                                end_time: day?.end_time || booking.end_time,
                                booking_days: booking.booking_days ?? [],
                              });
                            }}
                          >
                            <div className="booking-block-top">
                              <div className="booking-dots">...</div>
                            </div>
                            <div className="booking-block-bottom">
                              <img
                                src={booking.nanny?.photo
                                  || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                                className="booking-avatar"
                                alt="avatar"
                              />
                              <div className="booking-name-under">
                                {booking.nanny?.first_name}<br />{booking.nanny?.last_name}
                              </div>
                            </div>
                          </div>
                        );

                        })()}

                        </div>
                      );
                    });
                  })()}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    
      {selectedBookings.length > 0 && (
        <BookingDetailModalParentCalendar
          bookings={selectedBookings}
          initialIndex={selectedIndex}
          onClose={() => setSelectedBookings([])}
          onDelete={(id) => {
            setBookings((prev) => prev.filter(b => b.id !== id));
            setSelectedBookings((prev) => prev.filter(b => b.id !== id));
          }}
        />
      )}
    </div>
  );
};

export default ScheduleWeekViewParent;
