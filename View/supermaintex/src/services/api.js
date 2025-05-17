import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // cambia esto según tu servidor
});

// Interceptor opcional para agregar el token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
