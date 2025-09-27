// src/components/Loader.js
import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Animated, Easing, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function Loader({ message = "Cargando" }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState("");

  const { theme } = useContext(ThemeContext);

  // 🔄 Animación de giro
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 🔁 Animación de los puntitos
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % 4; // "", ".", "..", "..."
      setDots(".".repeat(i));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            borderColor: theme.primary,
            borderTopColor: "transparent",
            transform: [{ rotate: spin }],
          },
        ]}
      />
      <Text style={[styles.text, { color: theme.text }]}>
        {message}
        {dots}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderWidth: 6,
    borderRadius: 30,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
