// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);   // ✅ Guardamos datos del usuario
  const [loading, setLoading] = useState(true);

  // 🔹 Restaurar sesión guardada
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);

          // Llamamos al backend para obtener info del usuario
          const res = await api.get("/me");
          setUser(res.data); // incluye "es_admin"
        }
      } catch (err) {
        console.error("❌ Error restaurando sesión:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // 🔹 Guardar login
  const login = async (newToken) => {
    try {
      setToken(newToken);
      await AsyncStorage.setItem("token", newToken);

      // Traer usuario autenticado
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error("❌ Error en login:", err.message);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
