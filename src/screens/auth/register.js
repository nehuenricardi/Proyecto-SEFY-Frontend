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

export default function RegisterScreen({ navigation }) {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

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
    if (!dni || !nombre || !apellido) {
      Alert.alert("Error", "DNI, nombre y apellido son obligatorios");
      return;
    }

    try {
      const response = await api.post("/usuarios/", {
        dni,
        nombre,
        apellido,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
      });

      console.log("✅ Usuario creado:", response.data);
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.replace("Login");
    } catch (err) {
      console.error("❌ Error al registrar:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.detail || "No se pudo registrar el usuario"
      );
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
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Nombre"
        placeholderTextColor={theme.text}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Apellido"
        placeholderTextColor={theme.text}
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Teléfono"
        placeholderTextColor={theme.text}
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.text}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Dirección"
        placeholderTextColor={theme.text}
        value={direccion}
        onChangeText={setDireccion}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleRegister}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Registrar</Text>
      </TouchableOpacity>

      <Text
        style={[styles.link, { color: theme.secondary }]}
        onPress={() => navigation.navigate("Login")}
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
