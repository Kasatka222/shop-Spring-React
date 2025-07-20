import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Убедимся, что headers существует
      config.headers = config.headers || {};
      // Добавляем токен в заголовок Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Проверяем статус ответа
    if (error.response?.status === 401) {
      // Если токен невалидный или истек, удаляем его
      localStorage.removeItem("token");
      // Перенаправляем на страницу логина только если мы не на ней
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;