// src/components/Schedule/ScheduleMonthView.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingDetailModalParentCalendar from "../Modal/BookingDetailModalParentCalendar";
import axios from "../../axiosConfig";
import "../../styles/schedule.css";

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const weekDayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

const ScheduleMonthViewParent = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());  
  const [workingHoursByDate] = useState({});
  const navigate = useNavigate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  const shiftToMonday = (firstDayOfMonth + 6) % 7;
  const [currentDate] = useState(new Date());
  const [activatedDates, setActivatedDates] = useState({});


  const days = getDaysInMonth(year, month);

  useEffect(() => {
    axios.get("/api/parent/bookings")
      .then((res) => {       
        setBookings(res.data);
      });
  }, []);  

  
  const prevMonthDays = getDaysInMonth(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1
  );
  const leadingDays = prevMonthDays.slice(-shiftToMonday);
  const totalCells = leadingDays.length + days.length;
    const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    const nextMonthDays = getDaysInMonth(
    month === 11 ? year + 1 : year,
    month === 11 ? 0 : month + 1
    ).slice(0, trailingCount);
    const allDays = [...leadingDays, ...days, ...nextMonthDays];


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
      booking_days: booking.booking_days ?? [], 
    });

    period.setDate(period.getDate() + 1);
  }
});
  

  const changeMonth = (direction) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const BearIcon = ({  count, isPast, onClick, dateKey  }) => (
    <div
      className={`bear-icon-wrapper ${isPast ? "bear-icon-past" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="bear-label">Зустрічей</div>
      <div className="bear-icon">        
      <img
          src={            
            activatedDates[dateKey]
              ? (isPast ? "/assets/bear-icon-dark.png" : "/assets/bear-icon.png")
              : "/assets/bear-icon.png"
          }
          alt="Bear"
          className="bear-img"
        />
        <div className="bear-nose-heart">
          <span>{count}</span>
        </div>
      </div>
    </div>
  );  
  
  const openBookingModal = (dateKey) => {
    setActivatedDates(prev => ({ ...prev, [dateKey]: true }));
  
    const bookingsForDate = bookingsMap[dateKey] || [];
  
    const enriched = bookingsForDate.map(b => {
       const day = Array.isArray(b.booking_days)
  ? b.booking_days.find((d) => d.date === dateKey)
  : null;
      return {
        ...b,
        date: dateKey,
        start_time: day?.start_time ?? b.start_time,
        end_time: day?.end_time ?? b.end_time,
        booking_days: b.booking_days || [],
      };
    });
  
    setSelectedBookings(enriched); // 🔄 Встановлює всі картки
    setSelectedIndex(0);           // 🔢 Починаємо з першої
  };
   
  
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Понеділок — перший день
    return new Date(d.setDate(diff));
  };
  
  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  };
  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = getEndOfWeek(currentDate);
  
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
    
    const renderHourRange = (ranges) => {
      const selected = getSelectedHoursFromRanges(ranges);
      if (selected.length === 0) return null;
      return `${selected[0]} - ${selected[selected.length - 1]}`;
    };  

  const countUniqueBookingsPerDay = (dayBookings, dateKey) => {
  const uniqueBookingIds = new Set();

  for (const booking of dayBookings) {
    const days = Array.isArray(booking.booking_days) ? booking.booking_days : [];
    const hasDate = days.some(day => day.date === dateKey);
    if (hasDate) {
      uniqueBookingIds.add(booking.id);
    }
  }

  return uniqueBookingIds.size;
};
   const getBookingDaysSafe = (booking) => Array.isArray(booking.booking_days) ? booking.booking_days : [];
     
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
                    const fallbackDate = Array.isArray(booking.booking_days) && booking.booking_days.length > 0
                      ? booking.booking_days[0].date
                      : booking.start_date || booking.date;

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
                  const fallbackDate = Array.isArray(booking.booking_days) && booking.booking_days.length > 0
                  ? booking.booking_days[0].date
                  : booking.start_date || booking.date;

                  openBookingModal(fallbackDate, {
                    ...booking,
                    date: fallbackDate,
                    start_time: Array.isArray(booking.booking_days) && booking.booking_days.length > 0
                    ? booking.booking_days[0].start_time
                    : booking.start_time,
                    end_time: Array.isArray(booking.booking_days) && booking.booking_days.length > 0
                      ? booking.booking_days[0].end_time
                      : booking.end_time,
                      booking_days: booking.booking_days ?? [],
                    });
                }}>
                <img
                  src={booking.nanny?.photo
                    || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                  alt="Няня"
                  className="mini-avatar"
                />
               <div className="booking-mini-info">
              <p className="booking-name-mini">
                {booking.nanny?.first_name} {booking.nanny?.last_name}
              </p>

              {(() => {
                const uniqueDates = Array.from(new Set(getBookingDaysSafe(booking).map(d => d.date)));

                if (uniqueDates.length === 1) {
                 const sortedStarts = [...(getBookingDaysSafe(booking))].map(t => t.start_time).sort();
                  const sortedEnds = [...(getBookingDaysSafe(booking))].map(t => t.end_time).sort();
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
            <button onClick={() => changeMonth(-1)} className="month-nav">←</button>
            <h1 className="title-calendar">{new Date(year, month).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}</h1>
            <button onClick={() => changeMonth(1)} className="month-nav">→</button>
          </div>

          <div className="weekday-row">
            {weekDayNames.map((day, idx) => (
              <div key={idx} className="weekday-cell">{day}</div>
            ))}
          </div>

          <div className="month-grid">
          {allDays.map((day, idx) => {          
            const dateKey = formatDateKey(day);
            const isCurrentMonth = day.getMonth() === month;
            const dayBookings = bookingsMap[dateKey] || [];
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const isPastDate = day < today;

            const renderTopLeftCell = (isCurrentMonth, isPastDate, dayBookings, dateKey) => {
              if (!isCurrentMonth || isPastDate) return null;
              if (dayBookings.length > 0) {
                return (
                  <button
                    className="edit-hour-button"
                    onClick={() => {
                      const dateBookings = bookingsMap[dateKey] || [];
                    
                      if (dateBookings.length > 0) {
                        openBookingModal(dateKey, {
                          ...dateBookings[0], // або зроби вибір розумно
                          date: dateKey,
                          start_time: Array.isArray(dateBookings[0]?.booking_days) && dateBookings[0].booking_days.length > 0
                            ? dateBookings[0].booking_days[0].start_time
                            : dateBookings[0]?.start_time
                          || dateBookings[0]?.start_time,
                          end_time: dateBookings[0]?.booking_days?.[0]?.end_time || dateBookings[0]?.end_time,
                          booking_days: dateBookings[0]?.booking_days ?? [],
                        });
                      }
                    }}
                    
                    title="Редагувати години"
                  >
                    <img
                      src="/assets/edit-icon.svg"
                      alt="Редагувати"
                      className="edit-icon-image"
                    />
                  </button>
                );
              }
              return <div style={{ width: "24px" }}></div>;
            };
           
            return (
              <div key={dateKey + idx} className={`month-cell ${!isCurrentMonth ? "not-current" : ""}`}>
              <div className={`day-content ${isPastDate ? "past-date" : ""}`}>
                {/* Рядок 1: кнопка зліва, число справа */}
                <div className="top-row">
                {renderTopLeftCell(isCurrentMonth, isPastDate, dayBookings, dateKey)}
                  <div className="cell-date">{day.getDate()}</div>
                </div>
            
                {/* Рядок 2: години */}
                {workingHoursByDate[dateKey] && workingHoursByDate[dateKey].length > 0 && (
                 <div className="working-hours">
                 {renderHourRange(workingHoursByDate[dateKey])}
               </div>                
                )}
            
                {/* Рядок 3: ведмедик */}
{Array.isArray(bookingsMap[dateKey]) &&
 bookingsMap[dateKey].some(
   booking =>
     Array.isArray(booking.booking_days) &&
     booking.booking_days.some(day => day.date === dateKey)
 ) && (
  <BearIcon
    count={countUniqueBookingsPerDay(dayBookings, dateKey)}
    isPast={isPastDate}
    dateKey={dateKey}
    onClick={() => {
      openBookingModal(dateKey);
    }}
  />
)}



              </div>
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
              setSelectedBookings([]); // спочатку закриваємо модалку
              requestAnimationFrame(() => {
                setBookings(prev => prev.filter(b => b.id !== id));
              });
            }}            
          />
        )}    
    </div>
  );
};

export default ScheduleMonthViewParent;