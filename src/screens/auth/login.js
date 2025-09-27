// app/user/login.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const nav = useNavigation();

  // 🔹 Configurar header dinámico
  useEffect(() => {
    nav.setOptions({
      title: "Login",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [theme, nav]);

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { dni, nombre });
      await AsyncStorage.setItem("token", res.data.access_token);
      login(res.data.access_token);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Credenciales inválidas");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
  style={[
    styles.titleS,
    {
      color: theme.primary, // 🎨 color principal
      textShadowColor: theme.secondary, // sombra con color secundario
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
      letterSpacing: 2, // más separación entre letras
      textTransform: "uppercase", // todo mayúsculas
      fontSize: 45, 
      fontWeight: "bold", 
      marginBottom: 30, 
      textAlign: "center"
    },
  ]}
>
  Proyecto SEFY
</Text>
      <Text style={[styles.title, { color: theme.text }]}>Iniciar Sesión</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="DNI"
        placeholderTextColor={theme.text}
        value={dni}
        onChangeText={setDni}
      />

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Nombre"
        placeholderTextColor={theme.text}
        value={nombre}
        onChangeText={setNombre}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Ingresar</Text>
      </TouchableOpacity>

      <Text
        style={[styles.link, { color: theme.secondary }]}
        onPress={() => navigation.navigate("Register")}
      >
        ¿No tenés cuenta? Registrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 20, textAlign: "center", fontSize: 15, fontWeight: "500" },
});
