import React, { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import VariantHeaderNanny from "../components/Header/VariantHeaderNanny";
import Footer from "../components/Footer/Footer";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
  } from "recharts";
  
import "../styles/nannyBookingStats.css";

const NannyBookingStatsPage = () => {
    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/nanny/bookings/stats?year=${year}`).then((res) => {
          if (Array.isArray(res.data)) {
            setData(res.data);
          } else {
            setData([]); // fallback
            console.error("Очікувався масив, але отримано:", res.data);
          }
        }).catch((err) => {
          console.error("Помилка при завантаженні статистики:", err);
          setData([]); 
        });
      }, [year]);
       

  return (
    <div className="nanny-stats-page">
      <VariantHeaderNanny />
      <div className="stats-container">
      <button className="back-button-dark" onClick={() => navigate(-1)}>
          <span className="back-text">НАЗАД</span>
          <span className="back-arrow-dark"></span>
        </button>

        <h1 className="stats-title">СТАТИСТИКА БРОНЮВАНЬ</h1>
        <div className="chart-wrapper">
          <p className="chart-label">КІЛЬКІСТЬ БРОНЮВАНЬ ЗА {year}:</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4DB3AE" stopOpacity={10} />
                    <stop offset="100%" stopColor="#4DB3AE" stopOpacity={0.2} />
                </linearGradient>
                </defs>
                <XAxis 
                dataKey="month"
                stroke="#FFFAEE"        // колір осі
                strokeWidth={3}         // товщина лінії осі
                tick={{ fill: "#3A3B61", fontSize: 20 }} // колір і розмір підписів
                />

                <YAxis 
                domain={[0, 4]} 
                stroke="#FFFAEE" 
                strokeWidth={3} 
                tick={{ fill: "#3A3B61", fontSize: 20 }} 
                />
                <Tooltip />
                <Area
                type="monotone"
                dataKey="value"
                stroke="#4DB3AE"
                fill="url(#colorFill)"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#4DB3AE", fill: "#FFFAEE", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                />
            </AreaChart>
            </ResponsiveContainer>


            <div className="year-navigation">
                <span className="year-label">{year-1}</span>
                <button className="arrow-btn" onClick={() => setYear((prev) => prev - 1)}>←</button>                
                <button className="arrow-btn" onClick={() => setYear((prev) => prev + 1)}>→</button>
                <span className="year-label">{year+1}</span>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NannyBookingStatsPage;
