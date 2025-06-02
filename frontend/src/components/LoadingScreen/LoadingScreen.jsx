import React, { useEffect, useState } from "react";
import "../../styles/loading.css";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Проста симуляція прогресу
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-bear-box">
      <img
        src="/assets/loading-bear.png" 
        alt="Ведмедик завантажує"
        className="loading-bear"
      />
      </div>

      <h1 className="loading-title">ЗАВАНТАЖЕННЯ</h1>
      <div className="progress-bar-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="loading-subtitle">КОМАНДА ВЕДМЕДИКІВ ВЖЕ ГОТУЄ ДЛЯ ВАС СТОРІНКУ</h2>
      <p className="loading-description">
        Один ведмедик фарбує кнопки, інший друкує всі тексти, третій уважно тестує кожен елемент,
        а четвертий здуває пил із заголовків. Команда працює лапка до лапки!
      </p>
    </div>
  );
};

export default LoadingScreen;
