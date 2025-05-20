import React, { useState, useCallback, useEffect } from "react";
import "../../styles/schedule.css";
import axios from "../../axiosConfig";
import BookingDetailModalNannyCalendar from "../Modal/BookingDetailModalNannyCalendar";
import EditWorkingHoursModal from "../Modal/EditWorkingHoursModal";

const ScheduleDayView = ({ bookings, selectedDay}) => {
  const [dayDate, setDayDate] = useState(selectedDay ? new Date(selectedDay) : new Date());
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [workingHoursByDate, setWorkingHoursByDate] = useState({});
  // const today = new Date();
  const year = dayDate.getFullYear();
  const month = dayDate.getMonth() + 1;
  

const bookingsMap = {};

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  const dateKey = formatDateKey(dayDate);

  bookings.forEach((booking) => {
    const period = new Date(booking.start_date || booking.date);
    const end = new Date(booking.end_date || booking.date);

    while (period <= end) {
      const key = formatDateKey(period);
      if (!bookingsMap[key]) bookingsMap[key] = [];
      bookingsMap[key].push(booking);
      period.setDate(period.getDate() + 1);
    }
  });
 
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
  // const isStartOfFreeHourBlock = (hourStr, workingHours) => {
  //   return workingHours.some(range => {
  //     return range.start_time.slice(0, 2) === hourStr.slice(0, 2);
  //   });
  // };
  
  const getBlockForFreeHour = (hourStr, workingHours) => {
    return workingHours.find(range => range.start_time.slice(0, 2) === hourStr.slice(0, 2));
  };
  

  const renderHourSlots = () => {
    const hourHeight = 65;
    const dayBookings = bookingsMap[dateKey] || [];
  const workingHours = workingHoursByDate[dateKey] || [];
  const selectedHoursSet = new Set(getSelectedHoursFromRanges(workingHours));
  
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


const isHourBooked = !!bookingForThisHour;
const isHourInWorking = selectedHoursSet.has(hourStr);
const workingRange = getBlockForFreeHour(hourStr, workingHoursByDate[dateKey] || []);

const slotClass = isHourBooked ? "booked-day" : (isHourInWorking ? "available-hour" : "free");

    return (
      <div
        key={hour}
        className={`hour-slot-day ${slotClass}`}
        style={{ position: "relative" }}
      >
        <span className={`hour-label ${selectedHoursSet.has(hourStr) ? "selected-hour" : ""}`}>
          {hourStr}
        </span>

        {/* Відображення заброньованого блоку, якщо це початкова година бронювання */}
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
                    src={bookingToRender.parent?.photo || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                    className="booking-avatar-day"
                    alt="avatar"
                  />
                  <span className="booking-name-inline-day">
                    {bookingToRender.parent?.first_name} {bookingToRender.parent?.last_name}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

{!isHourBooked && workingRange && (
  <div
    className="working-block-day"   
  >   
  </div>
)}

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
  
  const startOfWeek = getStartOfWeek(dayDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });
  useEffect(() => {
    const year = dayDate.getFullYear();
    const month = dayDate.getMonth() + 1;
  
    const fetchWorkingHours = async () => {
      try {
        const res = await axios.get(`/api/nanny/working-hours/${year}/${month}`);
        const grouped = {};
        res.data.forEach((item) => {
          const key = item.start_date;
          grouped[key] = grouped[key] || [];
          grouped[key].push({
            start_time: item.start_time.slice(0, 5),
            end_time: item.end_time.slice(0, 5),
          });
        });
        setWorkingHoursByDate(prev => ({
          ...prev,
          ...grouped,
        }));        
      } catch (err) {
        console.error("Помилка завантаження робочих годин:", err);
      }
    };
  
    fetchWorkingHours();
  }, [dayDate]);
  

  const fetchWorkingHours = useCallback(async () => {
    try {
      const res = await axios.get(`/api/nanny/working-hours/${year}/${month + 1}`);
      const grouped = {};
      res.data.forEach((item) => {
        const key = item.start_date;
        grouped[key] = grouped[key] || [];
        grouped[key].push({
          start_time: item.start_time.slice(0, 5),
          end_time: item.end_time.slice(0, 5),
        });
      });
      setWorkingHoursByDate(prev => ({
        ...prev,
        ...grouped,
      }));      
    } catch (err) {
      console.error("Помилка завантаження робочих годин:", err);
    }
  }, [year, month]);
  
  useEffect(() => {
    fetchWorkingHours();
  }, [fetchWorkingHours]);
  
  
  const getSelectedHoursFromRanges = (ranges) => {
    const hours = new Set();
    ranges.forEach(range => {
      const start = parseInt(range.start_time?.slice(0, 2));
      const end = parseInt(range.end_time?.slice(0, 2));
      for (let h = start; h <= end; h++) {
        hours.add(`${h.toString().padStart(2, "0")}:00`);
      }
    });
    return Array.from(hours);
  };
  
  // const selectedHoursSet = new Set(getSelectedHoursFromRanges(workingHoursByDate[dateKey] || []));
     

  return (
    <div className="edit-page-container">
      <div className="schedule-layout">
        {/* Ліва панель */}
        <div className="left-sidebar">
          <h2 className="schedule-subtitle-left">Зустрічі на тижні</h2>
          {bookings
            .filter(booking => booking.booking_days?.some(day => {
              const date = new Date(day.date);
              return date >= startOfWeek && date <= days[6];
            }))
            .map(booking => (
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

                <div className="dots-button" onClick={() => openBookingModal({ ...booking, date: booking.booking_days?.[0]?.date })}>...</div>
                <div className="booking-card-mini" 
                onClick={() => {
                  const fallbackDate =
                    booking.booking_days?.[0]?.date || booking.start_date || booking.date;
                
                  openBookingModal(fallbackDate, {
                    ...booking,
                    date: fallbackDate,
                    start_time: booking.booking_days?.[0]?.start_time || booking.start_time,
                    end_time: booking.booking_days?.[0]?.end_time || booking.end_time,
                    booking_days: booking.booking_days ?? [], // ⬅️ ДОДАЙ ЦЕ
                  });
                }} >
                  <img
                    src={booking.parent?.photo || "https://nanny-bear-media-bucket.s3.eu-north-1.amazonaws.com/photos/parents/default-avatar.jpg"}
                    alt="Батько"
                    className="mini-avatar"
                  />
             <div className="booking-mini-info">
              <p className="booking-name-mini">
                {booking.parent?.first_name} {booking.parent?.last_name}
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
  {bookingsMap[dateKey]?.length > 0 ? (
    <button
      className="edit-hour-button"
      onClick={() => {
        const dateBookings = bookingsMap[dateKey];
        openBookingModal(dateKey, {
          ...dateBookings[0],
          date: dateKey,
          start_time: dateBookings[0]?.booking_days?.[0]?.start_time || dateBookings[0]?.start_time,
          end_time: dateBookings[0]?.booking_days?.[0]?.end_time || dateBookings[0]?.end_time,
          booking_days: dateBookings[0]?.booking_days ?? [],
        });
      }}
      title="Редагувати зустріч"
    >
      <img src="/assets/edit-icon.svg" alt="Редагувати" className="edit-icon-image" />
    </button>
  ) : workingHoursByDate[dateKey]?.length > 0 ? (
    <button
      className="edit-hour-button"
      onClick={() => setSelectedDate({ key: dateKey, fullDate: dayDate })}
      title="Редагувати години"
    >
      <img src="/assets/edit-icon.svg" alt="Редагувати години" className="edit-icon-image" />
    </button>
  ) : (
    <button
      className="add-hour-button"
      onClick={() => setSelectedDate({ key: dateKey, fullDate: dayDate })}
      title="Додати години"
    >
      +
    </button>
  )}
</div>


        {renderHourSlots()}
        </div>
        </div>
      </div>

      {selectedDate && (
        <EditWorkingHoursModal
        date={selectedDate.fullDate}
        initialHours={getSelectedHoursFromRanges(workingHoursByDate[selectedDate.key] || [])}       
               
        
        onClose={() => setSelectedDate(null)}
        onSave={async () => {
          await fetchWorkingHours();
          setSelectedDate(null); // просто закриваєш модалку
        }}        
        
      />      
      )}    

      {selectedBookings.length > 0 && (
        <BookingDetailModalNannyCalendar
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

export default ScheduleDayView;
