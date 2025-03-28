// pages/NannyListPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const NannyListPage = () => {
  const [nannies, setNannies] = useState([]);

  useEffect(() => {
    axios.get("/api/nanny-profiles", { withCredentials: true })
      .then((res) => setNannies(res.data))
      .catch((err) => console.error("Помилка при завантаженні нянь:", err));
  }, []);

  return (
    <div className="profile-container">
      <h1 className="title-light">Доступні няні</h1>
      <ul>
        {nannies.map((nanny) => (
          <li key={nanny.id}>
            <strong>{nanny.first_name} {nanny.last_name}</strong><br />
            📍 {nanny.city}, {nanny.district} <br />
            📞 {nanny.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NannyListPage;
