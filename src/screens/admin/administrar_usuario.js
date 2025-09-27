// src/screens/admin/administrar_usuario.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";

export default function AdministrarUsuarioScreen({ route, navigation }) {
  const { dni } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  // estados editables
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/usuarios/${dni}`);
        setUsuario(res.data);

        setNombre(res.data.nombre || "");
        setApellido(res.data.apellido || "");
        setTelefono(res.data.telefono || "");
        setEmail(res.data.email || "");
        setDireccion(res.data.direccion || "");
        setEsAdmin(res.data.es_admin || false);
      } catch (err) {
        console.error("❌ Error cargando usuario:", err.response?.data || err.message);
        Alert.alert("Error", "No se pudo cargar el usuario.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [dni]);

  const handleGuardar = async () => {
    try {
      await api.put(`/usuarios/${dni}`, {
        dni,
        nombre,
        apellido,
        telefono,
        email,
        direccion,
        es_admin: esAdmin,
      });
      Alert.alert("✅ Éxito", "Usuario actualizado correctamente");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error actualizando:", err.response?.data || err.message);
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  const handleEliminar = async () => {
    Alert.alert("⚠️ Confirmar", "¿Seguro que deseas eliminar este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/usuarios/${dni}`);
            Alert.alert("✅ Éxito", "Usuario eliminado correctamente");
            navigation.goBack();
          } catch (err) {
            console.error("❌ Error eliminando:", err.response?.data || err.message);
            Alert.alert("Error", "No se pudo eliminar el usuario");
          }
        },
      },
    ]);
  };

  if (loading) return <Loader/>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>👤 Administrar Usuario</Text>
      <Text style={[styles.subtitle, { color: theme.secondary }]}>DNI: {dni}</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Nombre"
        placeholderTextColor={theme.secondary}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Apellido"
        placeholderTextColor={theme.secondary}
        value={apellido}
        onChangeText={setApellido}
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
        placeholder="Email"
        placeholderTextColor={theme.secondary}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        placeholder="Dirección"
        placeholderTextColor={theme.secondary}
        value={direccion}
        onChangeText={setDireccion}
      />

      {/* Botón guardar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleGuardar}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>💾 Guardar cambios</Text>
      </TouchableOpacity>

      {/* Botón eliminar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary, marginTop: 10 }]}
        onPress={handleEliminar}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>🗑️ Eliminar usuario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
