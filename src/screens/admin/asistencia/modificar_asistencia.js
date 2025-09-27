// src/screens/admin/modificar_asistencia.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function ModificarAsistenciaScreen({ route, navigation }) {
  const { asistencia } = route.params;
  const [estado, setEstado] = useState(asistencia.estado);
  const [horaEntrada, setHoraEntrada] = useState(asistencia.hora_entrada || "");
  const [horaSalida, setHoraSalida] = useState(asistencia.hora_salida || "");
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put(`/asistencias/${asistencia.id_asistencia}`, {
        ...asistencia,
        estado,
        hora_entrada: horaEntrada || null,
        hora_salida: horaSalida || null,
      });
      Alert.alert("✅ Éxito", "Asistencia actualizada");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error actualizando asistencia:", err.response?.data || err.message);
      Alert.alert("⚠️ Error", "No se pudo actualizar la asistencia");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("⚠️ Confirmar", "¿Eliminar esta asistencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await api.delete(`/asistencias/${asistencia.id_asistencia}`);
            Alert.alert("✅ Eliminada", "Asistencia eliminada correctamente");
            navigation.goBack();
          } catch (err) {
            console.error("❌ Error eliminando asistencia:", err.response?.data || err.message);
            Alert.alert("⚠️ Error", "No se pudo eliminar la asistencia");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>✏️ Editar Asistencia</Text>
      <Text style={{ color: theme.text }}>📅 Día: {asistencia.dia}</Text>
      <Text style={{ color: theme.text }}>Asignación: {asistencia.id_asignacion}</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={estado}
        onChangeText={setEstado}
        placeholder="Estado (Presente / Ausente / Justificado)"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Hora de Entrada (HH:MM)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={horaEntrada}
        onChangeText={setHoraEntrada}
        placeholder="08:00"
        placeholderTextColor={theme.secondary}
      />

      <Text style={[styles.label, { color: theme.text }]}>Hora de Salida (HH:MM)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
        value={horaSalida}
        onChangeText={setHoraSalida}
        placeholder="17:00"
        placeholderTextColor={theme.secondary}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={handleUpdate}
      >
        <Text style={[styles.saveButtonText, { color: theme.text }]}>
          💾 Guardar cambios
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.secondary }]}
        onPress={handleDelete}
      >
        <Text style={[styles.saveButtonText, { color: theme.text }]}>
          🗑️ Eliminar asistencia
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  saveButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { fontSize: 16, fontWeight: "bold" },
});
