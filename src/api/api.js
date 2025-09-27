import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚙ URL del backend (usa la IP real de tu PC en la misma red que el celular)
const API_URL = "https://proyecto-sefy-backend.onrender.com";  

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Inyectar token JWT automáticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error obteniendo token:", err);
  }
  return config;
});

export default api;
