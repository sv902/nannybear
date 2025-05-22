import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../axiosConfig";
import VariantHeader from "../../components/Header/VariantHeader";
import Footer from "../../components/Footer/Footer";
import "../../styles/booking.css";

const BookingStep3 = () => {  
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const [editIndex, setEditIndex] = useState(null); 

  const { startDate, endDate, startTime, endTime } = location.state || {};

  const [nanny, setNanny] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [originalAddress, setOriginalAddress] = useState(null); 

  useEffect(() => {
    axios.get(`/api/nanny-profiles/${id}`)
      .then((res) => setNanny(res.data))
      .catch((err) => console.error("Помилка завантаження няні:", err));
  }, [id]);

  useEffect(() => {
    if (nanny?.user_id) {
      axios.get(`/api/reviews/${nanny.user_id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Помилка завантаження відгуків:", err));
    }
  }, [nanny]);

  useEffect(() => {
    axios.get("/api/parent/profile").then((res) => {
      const saved = res.data.profile?.addresses || [];
      setAddresses(saved);
    });
  }, []);  

  const handleChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  
    const addr = updated[index];
  
    // Порівняння для унікальних збережень
    if (originalAddress && JSON.stringify(addr) === JSON.stringify(originalAddress)) return;
  
    if (addr.id) {
      axios.put(`/api/parent/addresses/${addr.id}`, addr, { withCredentials: true })
        .then((res) => {
          setEditIndex(null);
          setOriginalAddress(null);
          setAddresses((prev) => {
            const updated = [...prev];
            updated[index] = res.data.address;
            return updated;
          });
        })
        .catch(err => console.error("❌ Помилка при оновленні адреси:", err));
    } else {
      axios.post("/api/booking-address", addr, { withCredentials: true })
        .then((res) => {
          const saved = res.data.address;
          setEditIndex(null);
          setOriginalAddress(null);
          setAddresses((prev) => {
            const updated = [...prev];
            updated[index] = saved;
            return updated;
          });
        })
        .catch(err => console.error("❌ Помилка при створенні нової адреси:", err));
    }
  };
  
   
  const handleAddOrSaveAddress = () => {
    if (editIndex !== null) {
      handleSave(editIndex);
    } else {
      const newAddress = {
        type: "",
        city: "",
        district: "",
        address: "",
        floor: "",
        apartment: ""
      };
      setAddresses((prev) => [...prev, newAddress]);
      setEditIndex(addresses.length);
      setOriginalAddress(newAddress);
    }
  };
        
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

   const handleNext = () => {
  const selected = addresses[selectedAddressIndex];

  if (!selected) {
    alert("Оберіть адресу для зустрічі");
    return;
  }

  // const { startTime, endTime } = location.state || {};
  const start = typeof startTime === "string" ? startTime : startTime?.start;
  const end = typeof endTime === "string" ? endTime : endTime?.end;

  const buildBookingDays = () => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10);
    const isFirst = dateStr === startDate;
    const isLast = dateStr === endDate;

    days.push({
      date: dateStr,
      start_time: isFirst ? startTime : "09:00", // або null
      end_time: isLast ? endTime : "18:00",       // або null
    });
  }

  return days;
};

const booking_days = buildBookingDays();


  navigate(`/booking/${id}/payment`, {
    state: {
      startDate,
      endDate,
      startTime: start,
      endTime: end,
      hourlyRate: nanny.hourly_rate,
      address: selected,
      totalHours: calculateHours(start, end),
      booking_days
    },
  });
};

    
    const calculateHours = (start, end) => {
      if (!start || !end) return 0; // 🛡 Захист

      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      return eh - sh + (em - sm) / 60;
    };

       
    const handleRemove = (index) => {
      const address = addresses[index];
      if (address.id) {
        axios.delete(`/api/parent/addresses/${address.id}`, { withCredentials: true })
          .then(() => {
            setAddresses(prev => prev.filter((_, i) => i !== index));
            if (editIndex === index) setEditIndex(null);
          })
          .catch((err) => {
            console.error("❌ Не вдалося видалити адресу:", err);
            alert("Помилка при видаленні адреси");
          });
      } else {
        // Тимчасово додана адреса, ще не збережена
        setAddresses(prev => prev.filter((_, i) => i !== index));
        if (editIndex === index) setEditIndex(null);
      }
    };  
    
    const handleSave = (index) => {
      const address = addresses[index];
    
      if (!address || !address.city) {
        alert("Місто є обов’язковим");
        return;
      }
    
      // якщо нічого не змінилося — нічого не робимо
      if (originalAddress && JSON.stringify(address) === JSON.stringify(originalAddress)) {
        setEditIndex(null);
        return;
      }
    
      const request = address.id
        ? axios.put(`/api/parent/addresses/${address.id}`, address, { withCredentials: true })
        : axios.post("/api/booking-address", address, { withCredentials: true });
    
      request
        .then((res) => {
          const updated = res.data.address;
          setAddresses((prev) => {
            const copy = [...prev];
            copy[index] = updated;
            return copy;
          });
          setEditIndex(null);
          setOriginalAddress(null);
        })
        .catch((err) => {
          console.error("❌ Помилка при збереженні адреси:", err);
          alert("Не вдалося зберегти адресу.");
        });
    };

    const handleCancel = (index) => {
      const address = addresses[index];
    
      // якщо це нова адреса (без id) — видаляємо
      if (!address.id) {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
      }
    
      setEditIndex(null);
      setOriginalAddress(null);
    };
    
    
    
  if (!nanny) return <div>Завантаження...</div>;

  return (
    <div className="booking-page">
      <VariantHeader />
      <div className="booking-container">
        <div className="booking-top-row">
          <div className="back-and-step">
            <button className="back-button-dark btn-next-booking" onClick={() => navigate(-1)}>
              <span className="back-text">НАЗАД</span>
              <span className="back-arrow-dark"></span>
            </button>
            <span className="step-indicator">Крок 3/4</span>
          </div>
        </div>

        <div className="booking-header-row">
          <h1 className="booking-title">ПЛАНУВАННЯ ЗУСТРІЧІ З</h1>
          <div className="nanny-profile-preview-edit-booking">
            <img
              src={nanny.photo}
              alt="Няня"
              className="nanny-booking-avatar-edit"
            />
            <div>
              <h2 className="nanny-booking-name">{nanny.first_name} <br /> {nanny.last_name}</h2>
              <div className="rating-stars-card-booking">
                {[1, 2, 3, 4, 5].map((i) => {
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
        </div>

        <div className="booking-subtitle-row">
          <h2 className="booking-subtitle">Вкажіть адресу</h2>
          <p className="booking-description">вкажіть адресу, щоб няня змогла легко знайти Вас</p>
        </div>
       
        {addresses.map((address, index) => (
          <div key={index} className="address-block">
            {editIndex === index ? (
              <div className="address-edit-fields">
                <div className="type-label-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Тип</label>
                <button
                  onClick={() => handleCancel(index)}
                  className="cancel-edit-btn"
                  style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", lineHeight: "1" }}
                  title="Скасувати редагування"
                >
                  ✖
                </button>
              </div>
              <input
                value={address.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                placeholder="Тип (Дім / Робота...)"
              />               
                <div className="name-container">
                  <label className="name-input-p left-label">МІСТО</label>
                  <p className="required-field right-required">обов’язкове поле</p>
                </div>
                <input          
                  type="text"
                  placeholder="Місто..."
                  value={address.city}
                  onChange={(e) => handleChange(index, "city", e.target.value)}
                  required
                />
                 <label className="name-input-p left-label">Район</label>
                <input placeholder="Ваш район..." value={address.district} onChange={(e) => handleChange(index, "district", e.target.value)} />
                <label className="name-input-p left-label">Вулиця</label>
                <input placeholder="Вулиця та номер дому..." value={address.address} onChange={(e) => handleChange(index, "address", e.target.value)} />
                <div className="row-address-fields">
                  <div className="field-wrapper">
                    <label className="name-input-p left-label">Поверх</label>
                    <input
                      placeholder="№ поверху..."
                      value={address.floor}
                      onChange={(e) => handleChange(index, "floor", e.target.value)}
                    />
                  </div>
                  <div className="field-wrapper">
                    <label className="name-input-p left-label">Квартира</label>
                    <input
                      placeholder="№ квартири..."
                      value={address.apartment}
                      onChange={(e) => handleChange(index, "apartment", e.target.value)}
                    />
                  </div>
                </div>                
               </div>
            ) : (
              <div className="address-row">
              <div className="address-view">
              <div className="address-selectable">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressIndex === index}
                  onChange={() => setSelectedAddressIndex(index)}
                />
                <p className="address-type"><strong>{address.type || "—"}</strong></p>
              </div>
                <p>{address.city || "—"}, {address.district || "—"}</p>
                <p>{address.address || "—"}</p>
                <p>Поверх: {address.floor || "—"}, Квартира: {address.apartment || "—"}</p>
              </div>
              <div className="address-actions">
                <button className="edit_address-btn" onClick={() => setEditIndex(index)}>Редагувати</button>
                <button className="rem-address-btn" onClick={() => handleRemove(index)}>✖</button>
              </div>
            </div>
            )}
          </div>
        ))}

        <div className="save-btn-cont-location"> 
        <div className="save-btn-cont-location"> 
          <button onClick={handleAddOrSaveAddress} className="save-address-btn">
            {editIndex !== null ? "Зберегти адресу" : "Додати адресу"}
          </button>
        </div>
        </div>

        <button className="next-button-booking" onClick={handleNext}>ДАЛІ</button>
        <p className="text-confident">Ми цінуємо вашу довіру й суворо дотримуємося принципів конфіденційності, <br/> ваші особисті дані не передаються стороннім особам.</p>
      </div>
      <Footer />
    </div>
  );
};

export default BookingStep3;
