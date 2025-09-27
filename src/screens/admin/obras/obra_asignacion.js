// src/screens/admin/obra_asignacion.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function ObraAsignacionScreen({ route }) {
  const { id_obra } = route.params;
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { theme } = useContext(ThemeContext);

  const fetchAsignaciones = async () => {
    try {
      setLoading(true);
      const res = await api.get("/asignaciones/");
      const filtradas = res.data.filter((a) => a.id_obra === id_obra);
      setAsignaciones(filtradas);
    } catch (err) {
      console.error("❌ Error cargando asignaciones:", err.response?.data || err.message);
      Alert.alert("⚠️ Error", "No se pudieron cargar las asignaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaciones();
  }, [id_obra]);

  const marcarAsistencia = async (dni_usuario, id_asignacion, estado) => {
    try {
      setProcessing(true);
      await api.post("/asistencias/tomar", {
        dni_usuario,
        id_asignacion,
        estado,
      });
      Alert.alert("✅ Éxito", `Asistencia marcada como ${estado}`);
    } catch (err) {
      console.error("❌ Error al tomar asistencia:", err.response?.data || err.message);
      Alert.alert("Error", "No se pudo registrar la asistencia");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader/>;
  if (processing) return <Loader message="Registrando" />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        👷 Asignaciones de la Obra #{id_obra}
      </Text>

      <FlatList
        data={asignaciones}
        keyExtractor={(item) => item.id_asignacion.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.asignacion,
              { backgroundColor: theme.card, borderColor: theme.primary },
            ]}
          >
            <Text style={[styles.user, { color: theme.text }]}>
              👤 {item.dni_usuario} - Rol: {item.rol_empleado}
            </Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() =>
                  marcarAsistencia(item.dni_usuario, item.id_asignacion, "Presente")
                }
              >
                <Text style={styles.buttonText}>Presente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() =>
                  marcarAsistencia(item.dni_usuario, item.id_asignacion, "Ausente")
                }
              >
                <Text style={styles.buttonText}>Ausente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "orange" }]}
                onPress={() =>
                  marcarAsistencia(item.dni_usuario, item.id_asignacion, "Justificado")
                }
              >
                <Text style={styles.buttonText}>Justificado</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondary }]}>
            No hay asignaciones en esta obra.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  asignacion: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
  },
  user: { fontSize: 16, marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-around" },
  button: {
    padding: 8,
    borderRadius: 5,
    minWidth: 90,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
