// app/user/perfil.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function PerfilScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme, themeName, updateCustomTheme } =
    useContext(ThemeContext);
  const navigation = useNavigation();

  // Campos editables
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: "Perfil",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff",
    });
  }, [theme, navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
        setEmail(res.data.email || "");
        setTelefono(res.data.telefono || "");
        setDireccion(res.data.direccion || "");
      } catch (err) {
        console.error(
          "❌ Error cargando perfil:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
  try {
    await api.put(`/usuarios/${user.dni}`, {
      // campos obligatorios del backend
      dni: user.dni,
      nombre: user.nombre,
      apellido: user.apellido,
      es_admin: user.es_admin,

      // campos editables
      email: email || user.email,
      telefono: telefono || user.telefono,
      direccion: direccion || user.direccion,
    });

    Alert.alert("✅ Éxito", "Datos actualizados correctamente");

    // refrescar datos locales
    setUser({
      ...user,
      email,
      telefono,
      direccion,
    });
  } catch (err) {
    console.error(
      "❌ Error actualizando perfil:",
      err.response?.data || err.message
    );
    Alert.alert("Error", "No se pudieron guardar los cambios");
  }
};

  if (loading) return <Loader/>;

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.secondary }]}>
          No se pudo cargar el perfil.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* Datos fijos */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.name, { color: theme.text }]}>
          {user.nombre} {user.apellido}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>DNI: {user.dni}</Text>
      </View>

      {/* Datos editables */}
      <View
        style={[styles.card, { backgroundColor: theme.card, marginTop: 20 }]}
      >
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          placeholder="Email"
          placeholderTextColor={theme.secondary}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          placeholder="Teléfono"
          placeholderTextColor={theme.secondary}
          value={telefono}
          onChangeText={setTelefono}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
          placeholder="Dirección"
          placeholderTextColor={theme.secondary}
          value={direccion}
          onChangeText={setDireccion}
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: theme.text }]}>
            Guardar Cambios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botones de tema */}
      <View style={[styles.buttons, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.primary }]}
          onPress={() => toggleTheme("light")}
        >
          <Text style={[styles.themeButtonText, { color: theme.text }]}>
            🌞 Tema Claro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.primary }]}
          onPress={() => toggleTheme("dark")}
        >
          <Text style={[styles.themeButtonText, { color: theme.text }]}>
            🌚 Tema Oscuro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.primary }]}
          onPress={() => toggleTheme("custom")}
        >
          <Text style={[styles.themeButtonText, { color: theme.text }]}>
            🎨 Tema Personalizado
          </Text>
        </TouchableOpacity>
      </View>

      {/* Configuración de tema personalizado */}
      {themeName === "custom" && (
        <View
          style={[styles.cardc, { backgroundColor: theme.card, marginTop: 20 }]}
        >
          <Text style={[styles.info, { color: theme.text, marginBottom: 10 }]}>
            🎨 Configurar Tema Personalizado
          </Text>

          <Text style={[styles.info, { color: theme.text }]}>Fondo:</Text>
          <View style={styles.paletteRow}>
            {["#00d0ffff", "#00ff5eff", "#ff00d9ff"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => updateCustomTheme({ background: color })}
              />
            ))}
          </View>

          <Text style={[styles.info, { color: theme.text }]}>Primario:</Text>
          <View style={styles.paletteRow}>
            {["#00d0ffff", "#00ff5eff", "#ff00d9ff"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => updateCustomTheme({ primary: color })}
              />
            ))}
          </View>

          <Text style={[styles.info, { color: theme.text }]}>Secundario:</Text>
          <View style={styles.paletteRow}>
            {["#ffdd00ff", "#00ccffff", "#FF2D55"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => updateCustomTheme({ secondary: color })}
              />
            ))}
          </View>

          <Text style={[styles.info, { color: theme.text }]}>Tarjeta:</Text>
          <View style={styles.paletteRow}>
            {["#00d0ffff", "#00ff5eff", "#ff00d9ff"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => updateCustomTheme({ card: color })}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  buttons: {
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  themeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  themeButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  paletteRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
    cardc: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 100,
  },
});
