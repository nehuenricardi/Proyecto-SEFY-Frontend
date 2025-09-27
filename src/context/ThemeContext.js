// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme, CustomTheme } from "../theme/colors";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light");
  const [customTheme, setCustomTheme] = useState(CustomTheme);

  const themes = {
    light: LightTheme,
    dark: DarkTheme,
    custom: customTheme,
  };

  // Persistir en AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeName");
        const savedCustom = await AsyncStorage.getItem("customTheme");
        if (savedTheme) setThemeName(savedTheme);
        if (savedCustom) setCustomTheme(JSON.parse(savedCustom));
      } catch (err) {
        console.error("⚠️ Error cargando tema:", err);
      }
    })();
  }, []);

  const toggleTheme = async (newTheme) => {
    if (themes[newTheme]) {
      setThemeName(newTheme);
      await AsyncStorage.setItem("themeName", newTheme);
    }
  };

  const updateCustomTheme = async (updates) => {
    const newCustom = { ...customTheme, ...updates };
    setCustomTheme(newCustom);
    setThemeName("custom");
    await AsyncStorage.setItem("customTheme", JSON.stringify(newCustom));
    await AsyncStorage.setItem("themeName", "custom");
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeName], themeName, toggleTheme, updateCustomTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
