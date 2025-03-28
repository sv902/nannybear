// src/axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true;

// Базовий URL для запитів
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true, // Дозволяємо передавати куки
  });
  

// витягуємо токен з cookie вручну:
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Глобальний interceptor для обробки помилок
instance.interceptors.response.use(
    response => response, // просто повертає відповідь
    error => {
      // Тут ловимо всі помилки
      if (error.response) {
        const status = error.response.status;
  
        if (status === 401) {
          console.warn("⛔ Неавторизований. Можливо, користувач вийшов із системи.");
          // Можна перенаправити на логін:
          // window.location.href = "/login";
        }
  
        if (status === 403) {
          console.warn("🚫 Доступ заборонено");
        }
  
        if (status >= 500) {
          console.error("💥 Помилка сервера");
        }
      }
  
      return Promise.reject(error);
    }
  );

export default instance;
