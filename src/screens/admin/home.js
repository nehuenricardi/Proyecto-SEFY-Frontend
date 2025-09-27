// app/screens/admin/home.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function AdminHome({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>⚙️ Panel de Administrador</Text>

      {/* Botones de navegación */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("TomarAsistencia")}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>🕒 Tomar Asistencia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("Obras")}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>🏗️ Gestión de Obras</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("Usuarios")}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>👥 Gestión de Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("Perfil")}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>👤 Mi Perfil</Text>
      </TouchableOpacity>

      {/* Logout separado con secondary */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary, marginTop: 20 }]}
        onPress={logout}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>❌ Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
