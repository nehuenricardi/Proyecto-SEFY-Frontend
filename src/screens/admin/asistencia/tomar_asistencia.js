// src/screens/admin/tomar_asistencia.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function TomarAsistenciaScreen({ navigation }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);

  const fetchObras = async () => {
    try {
      setLoading(true);
      const res = await api.get("/obras/");
      setObras(res.data);
    } catch (err) {
      console.error("❌ Error cargando obras:", err.response?.data || err.message);
      alert("⚠️ Error: No se pudieron cargar las obras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>📋 Tomar Asistencia</Text>

      {/* Botón de editar asistencias */}
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("AdministrarAsistenciaUsuario")}
        activeOpacity={0.8}
      >
        <Text style={[styles.editButtonText, { color: theme.text }]}>
          ✏️ Editar asistencias
        </Text>
      </TouchableOpacity>

      {/* Listado de obras */}
      <FlatList
        data={obras}
        keyExtractor={(item) => item.id_obra.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() =>
              navigation.navigate("ObraAsignacionScreen", { id_obra: item.id_obra })
            }
          >
            <Text style={[styles.itemTitle, { color: theme.text }]}>
              {item.nombre_obra}
            </Text>
            <Text style={{ color: theme.text }}>📍 {item.direccion}</Text>
            <Text style={{ color: theme.text }}>⚡ Estado: {item.estado}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondary }]}>
            No hay obras registradas.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  editButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  empty: { textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
