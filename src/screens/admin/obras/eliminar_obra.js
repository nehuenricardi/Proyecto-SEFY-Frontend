// src/screens/admin/eliminar_obras.js
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

export default function EliminarObrasScreen() {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  const handleDelete = (id_obra, nombre) => {
    Alert.alert(
      "⚠️ Confirmar eliminación",
      `¿Estás seguro que querés eliminar la obra "${nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/obras/${id_obra}`);
              Alert.alert("✅ Eliminada", "La obra fue eliminada correctamente");
              fetchObras();
            } catch (err) {
              console.error("❌ Error eliminando obra:", err.response?.data || err.message);
              Alert.alert("⚠️ Error", "No se pudo eliminar la obra");
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>🗑️ Eliminar Obras</Text>

      <FlatList
        data={obras}
        keyExtractor={(item) => item.id_obra.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() => handleDelete(item.id_obra, item.nombre_obra)}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  empty: { textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
