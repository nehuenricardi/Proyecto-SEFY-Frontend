// src/screens/admin/obras_detail.js
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
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function ObraDetailAdminScreen({ route, navigation }) {
  const { id_obra } = route.params;
  const [obra, setObra] = useState(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { theme } = useContext(ThemeContext);

  // 🔹 Cargar datos de la obra
  useEffect(() => {
    const fetchObra = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/obras/${id_obra}`);
        setObra(res.data);

        setNombre(res.data.nombre_obra);
        setDireccion(res.data.direccion);
        setFechaInicio(res.data.fecha_inicio || "");
        setFechaFin(res.data.fecha_fin || "");
        setEstado(res.data.estado);
      } catch (err) {
        console.error("❌ Error cargando obra:", err.response?.data || err.message);
        Alert.alert("⚠️ Error", "No se pudo cargar la obra");
      } finally {
        setLoading(false);
      }
    };

    fetchObra();
  }, [id_obra]);

  // 🔹 Guardar cambios
  const handleUpdate = async () => {
    try {
      setProcessing(true);
      await api.put(`/obras/${id_obra}`, {
        nombre_obra: nombre,
        direccion,
        fecha_inicio: fechaInicio || null,
        fecha_fin: fechaFin || null,
        estado,
      });

      Alert.alert("✅ Éxito", "Obra actualizada correctamente");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error actualizando obra:", err.response?.data || err.message);
      Alert.alert("⚠️ Error", "No se pudo actualizar la obra");
    } finally {
      setProcessing(false);
    }
  };

  // 🔹 Eliminar obra
  const handleDelete = async () => {
    Alert.alert("⚠️ Confirmar", "¿Estás seguro que querés eliminar esta obra?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setProcessing(true);
            await api.delete(`/obras/${id_obra}`);
            Alert.alert("✅ Eliminada", "La obra fue eliminada correctamente");
            navigation.goBack();
          } catch (err) {
            console.error("❌ Error eliminando obra:", err.response?.data || err.message);
            Alert.alert("⚠️ Error", "No se pudo eliminar la obra");
          } finally {
            setProcessing(false);
          }
        },
      },
    ]);
  };

  if (loading) return <Loader/>;
  if (processing) return <Loader message="Procesando" />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>🛠️ Editar Obra</Text>

      <Text style={[styles.label, { color: theme.text }]}>Nombre de la obra</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre de la obra"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Dirección</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Fecha de inicio (YYYY-MM-DD)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={fechaInicio}
        onChangeText={setFechaInicio}
        placeholder="2025-01-01"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Fecha de fin (YYYY-MM-DD)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={fechaFin}
        onChangeText={setFechaFin}
        placeholder="2025-12-31"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Estado</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={estado}
        onChangeText={setEstado}
        placeholder="En progreso / Finalizada / Pendiente"
        placeholderTextColor={theme.secondary}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={handleUpdate}
      >
        <Text style={[styles.saveButtonText, { color: theme.text }]}>💾 Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.secondary }]}
        onPress={handleDelete}
      >
        <Text style={[styles.saveButtonText, { color: theme.text }]}>🗑️ Eliminar obra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 15,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
