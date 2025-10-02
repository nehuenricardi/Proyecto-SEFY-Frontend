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

// 👉 función util para mostrar mensajes de error claros
function showLoginError(err) {
  // Axios error?
  const isAxiosErr = !!(err && (err.isAxiosError || err.response || err.request || err.code));

  if (!isAxiosErr) {
    console.error("Error no Axios:", err);
    Alert.alert("Error", "Ocurrió un error inesperado. Intentá nuevamente.");
    return;
  }

  // ⏳ Timeout (axios usa code === 'ECONNABORTED')
  if (err.code === "ECONNABORTED" || /timeout/i.test(err.message || "")) {
    Alert.alert(
      "Tiempo de espera agotado",
      "El servidor no respondió a tiempo. Revisá tu conexión o intentá más tarde."
    );
    return;
  }

  // 📶 No hubo respuesta del servidor (problema de red / CORS / DNS / servidor caído)
  if (err.request && !err.response) {
    console.error("Sin respuesta del servidor:", err.message);
    Alert.alert(
      "Sin conexión con el servidor",
      "No pudimos conectarnos al backend. Verificá tu Internet o que el servidor esté en línea."
    );
    return;
  }

  // 📨 Hay respuesta HTTP con status
  const status = err.response?.status;
  const serverDetail =
    err.response?.data?.detail ||
    err.response?.data?.message ||
    (typeof err.response?.data === "string" ? err.response.data : null);

  if (status === 400 || status === 401) {
    Alert.alert("Credenciales inválidas", serverDetail || "DNI o nombre incorrectos.");
    return;
  }
  if (status === 403) {
    Alert.alert("Acceso denegado", serverDetail || "No tenés permisos para continuar.");
    return;
  }
  if (status === 404) {
    Alert.alert("Recurso no encontrado", serverDetail || "El endpoint /login no fue encontrado.");
    return;
  }
  if (status === 429) {
    Alert.alert("Demasiadas solicitudes", serverDetail || "Probá nuevamente en unos minutos.");
    return;
  }
  if (status >= 500) {
    Alert.alert(
      "Error del servidor",
      serverDetail || "Tuvimos un problema del lado del servidor. Intentá más tarde."
    );
    return;
  }

  // 🧰 Caso genérico
  Alert.alert("Error", serverDetail || "Ocurrió un error. Intentá nuevamente.");
}

export default function LoginScreen({ navigation }) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
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
    // Validación rápida de inputs
    if (!dni.trim() || !nombre.trim()) {
      Alert.alert("Faltan datos", "Completá DNI y Nombre para continuar.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/login", { dni: dni.trim(), nombre: nombre.trim() });

      const token = res?.data?.access_token;
      if (!token) {
        Alert.alert("Error", "El servidor no devolvió un token válido.");
        return;
      }

      await AsyncStorage.setItem("token", token);
      login(token); // 👉 actualiza el contexto/auth
    } catch (err) {
      console.error("Login error:", err);
      showLoginError(err); // 👉 mensajes específicos según el tipo de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={[
          styles.titleS,
          {
            color: theme.primary,
            textShadowColor: theme.secondary,
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: 45,
            fontWeight: "bold",
            marginBottom: 30,
            textAlign: "center",
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
        keyboardType="numeric"
        value={dni}
        onChangeText={setDni}
        editable={!loading}
      />

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Nombre"
        placeholderTextColor={theme.text}
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[styles.link, { color: theme.secondary }]}
        onPress={() => !loading && navigation.navigate("Register")}
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
