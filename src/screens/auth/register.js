// app/auth/register.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import { ThemeContext } from "../../context/ThemeContext";

// 👉 util para mensajes de error consistentes (similar al login)
function showRegisterError(err) {
  const isAxiosErr = !!(err && (err.isAxiosError || err.response || err.request || err.code));

  if (!isAxiosErr) {
    console.error("Error no Axios:", err);
    Alert.alert("Error", "Ocurrió un error inesperado. Intentá nuevamente.");
    return;
  }

  // ⏳ Timeout
  if (err.code === "ECONNABORTED" || /timeout/i.test(err.message || "")) {
    Alert.alert(
      "Tiempo de espera agotado",
      "El servidor no respondió a tiempo. Revisá tu conexión o intentá más tarde."
    );
    return;
  }

  // 📶 Sin respuesta del servidor
  if (err.request && !err.response) {
    console.error("Sin respuesta del servidor:", err.message);
    Alert.alert(
      "Sin conexión con el servidor",
      "No pudimos conectarnos al backend. Verificá tu Internet o que el servidor esté en línea."
    );
    return;
  }

  // 📨 Con respuesta HTTP
  const status = err.response?.status;
  const serverDetail =
    err.response?.data?.detail ||
    err.response?.data?.message ||
    (typeof err.response?.data === "string" ? err.response.data : null);

  // Datos inválidos / credenciales inválidas / validación
  if (status === 400 || status === 401 || status === 422) {
    Alert.alert("Datos inválidos", serverDetail || "Revisá los campos ingresados.");
    return;
  }

  // Conflicto (por ej. DNI ya registrado)
  if (status === 409) {
    Alert.alert("Conflicto", serverDetail || "El usuario ya existe.");
    return;
  }

  if (status === 403) {
    Alert.alert("Acceso denegado", serverDetail || "No tenés permisos para esta acción.");
    return;
  }

  if (status === 404) {
    Alert.alert("Recurso no encontrado", serverDetail || "El endpoint /usuarios/ no fue encontrado.");
    return;
  }

  if (status === 429) {
    Alert.alert("Demasiadas solicitudes", serverDetail || "Probá nuevamente en unos minutos.");
    return;
  }

  if (status >= 500) {
    Alert.alert("Error del servidor", serverDetail || "Tuvimos un problema del lado del servidor.");
    return;
  }

  // 🧰 Genérico
  Alert.alert("Error", serverDetail || "Ocurrió un error. Intentá nuevamente.");
}

export default function RegisterScreen({ navigation }) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const nav = useNavigation();

  // 🔹 Header dinámico con colores de tema
  useEffect(() => {
    nav.setOptions({
      title: "Registro",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [theme, nav]);

  const handleRegister = async () => {
    // Validaciones mínimas
    if (!dni.trim() || !nombre.trim() || !apellido.trim()) {
      Alert.alert("Error", "DNI, nombre y apellido son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        dni: dni.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono?.trim() || null,
        email: email?.trim() || null,
        direccion: direccion?.trim() || null,
      };

      const response = await api.post("/usuarios/", payload);

      console.log("✅ Usuario creado:", response.data);
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.replace("Login");
    } catch (err) {
      console.error("❌ Error al registrar:", err?.response?.data || err?.message || err);
      showRegisterError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Registro</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="DNI"
        placeholderTextColor={theme.text}
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
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
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Apellido"
        placeholderTextColor={theme.text}
        value={apellido}
        onChangeText={setApellido}
        autoCapitalize="words"
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Teléfono"
        placeholderTextColor={theme.text}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.text}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Dirección"
        placeholderTextColor={theme.text}
        value={direccion}
        onChangeText={setDireccion}
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 },
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {loading ? "Registrando..." : "Registrar"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[styles.link, { color: theme.secondary }]}
        onPress={() => !loading && navigation.navigate("Login")}
      >
        ¿Ya tenés cuenta? Iniciá sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
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
  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});
