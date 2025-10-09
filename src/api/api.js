import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚙ URL del backend (usa la IP real de tu PC en la misma red que el celular)
const API_URL = "https://proyecto-sefy-backend-8m76.onrender.com";
/* const API_URL = "http://128.3.254.143:8000"; */

const api = axios.create({
  baseURL: API_URL,
  timeout: 1000000,
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
