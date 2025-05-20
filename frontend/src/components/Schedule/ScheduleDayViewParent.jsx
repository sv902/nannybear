import React, { useState } from "react";
import "../../styles/schedule.css";
import BookingDetailModalParentCalendar from "../Modal/BookingDetailModalParentCalendar";


const ScheduleDayViewParent = ({ bookings, selectedDay}) => {
  const [dayDate, setDayDate] = useState(selectedDay ? new Date(selectedDay) : new Date());
  const [selectedBookings, setSelectedBookings] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const formatDateKey = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateKey = formatDateKey(dayDate);

  const bookingsMap = {};

  bookings.forEach((booking) => {
    const period = new Date(booking.start_date || booking.date);
    const end = new Date(booking.end_date || booking.date);

 while (period <= end) {
  const dateKey = formatDateKey(period);
  const hasBookingThatDay = Array.isArray(booking.booking_days) &&
    booking.booking_days.some(d => d.date === dateKey);

  if (hasBookingThatDay) {
    console.log("✅ Бронювання на дату:", dateKey, booking.id);
    if (!bookingsMap[dateKey]) bookingsMap[dateKey] = [];
    bookingsMap[dateKey].push(booking);
  } else {
    console.log("⛔️ Пропускаємо дату без зустрічі:", dateKey, booking.id);
  }

  period.setDate(period.getDate() + 1);
}

  });


  const dayBookings = bookings.filter((b) => b.date === dateKey);

  const goToPreviousDay = () => {
    const prev = new Date(dayDate);
    prev.setDate(prev.getDate() - 1);
    setDayDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(dayDate);
    next.setDate(next.getDate() + 1);
    setDayDate(next);
  };

  const openBookingModal = (dateKey, clickedBooking = null) => {  
   
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

  const renderHourSlots = () => {
    const hourHeight = 65;
    const dayBookings = bookingsMap[dateKey] || [];
  
    return [...Array(25)].map((_, hour) => {
      const hourStr = `${hour.toString().padStart(2, "0")}:00`;
  
      const bookingForThisHour = dayBookings.find(b =>
        b.booking_days?.some(d =>
          d.date === dateKey &&
          parseInt(d.start_time.slice(0, 2)) <= hour &&
          parseInt(d.end_time.slice(0, 2)) >= hour
        )
      );
  
      const bookingToRender = dayBookings.find(b => {
        const d = b.booking_days?.find(d => d.date === dateKey);
        const startHour = parseInt(d?.start_time?.slice(0, 2));
        return hour === startHour;
      });
  
      const slotClass = bookingForThisHour ? "booked-day" : "free";
  
      return (
        <div
          key={hour}
          className={`hour-slot-day ${slotClass}`}
          style={{ position: "relative" }}
        >
          <span className="hour-label">{hourStr}</span>
  
          {bookingToRender && (() => {
            const d = bookingToRender.booking_days?.find(d => d.date === dateKey);
            const startHour = parseInt(d?.start_time?.slice(0, 2));
            const endHour = parseInt(d?.end_time?.slice(0, 2));
            const blockHeight = (endHour - startHour) * hourHeight;
  
            return (
              <div
                className="booking-block-day"
                style={{ height: `${blockHeight}px`, top: 0 }}
                onClick={() =>
                  openBookingModal(dateKey, {
                    ...bookingToRender,
                    date: dateKey,
                    start_time: d?.start_time,
                    end_time: d?.end_time,
                    booking_days: bookingToRender.booking_days,
                  })
                }
              >
                <div className="booking-block-top-day">...</div>
                <div className="booking-block-bottom-day">
                  <div className="avatar-name-inline">
                    <img
                     src={booking.nanny?.photo
                        || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                      className="booking-avatar-day"
                      alt="avatar"
                    />
                    <span className="booking-name-inline-day">
                      {bookingToRender.nanny?.first_name} {bookingToRender.nanny?.last_name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      );
    });
  };
  
  
  
     
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  };
  
  const startOfWeek = getStartOfWeek(dayDate);
  const endOfWeek = getEndOfWeek(dayDate);
  
  return (
    <div className="edit-page-container">
      <div className="schedule-layout">
        {/* Ліва панель */}
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
                  src={
                    booking.nanny?.photo && booking.nanny.photo.startsWith("http")
                      ? booking.nanny.photo
                      : `${process.env.REACT_APP_API_URL}/storage/${booking.nanny?.photo || "default-avatar.jpg"}`
                  }
                  alt="Няня"
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

        {/* Колонка дня */}
        <div className="calendar-column">
        <div className="calendar-header">
        <button onClick={goToPreviousDay} className="month-nav">←</button>
        <h1 className="title-calendar">
          {dayDate.toLocaleDateString("uk-UA", {
            weekday: "long",
            day: "numeric",
            month: "long"
          })}
        </h1>
        <button onClick={goToNextDay} className="month-nav">→</button>
              </div>

              <div className="week-grid-single-column">
              <div className="day-inline-actions">
                {dayBookings.length > 0 ? (
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
                ) : null}
              </div>

              {renderHourSlots()}
            </div>

        </div>
      </div>
     
      {selectedBookings.length > 0 && (
        <BookingDetailModalParentCalendar
          bookings={selectedBookings}
          initialIndex={selectedIndex}
          onClose={() => setSelectedBookings([])}
          onDelete={(id) => {         
            setSelectedBookings((prev) => prev.filter(b => b.id !== id));
          }}
        />
      )}
    </div>
  );
};

export default ScheduleDayViewParent;
