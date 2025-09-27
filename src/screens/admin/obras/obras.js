// src/screens/admin/obras.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableOpacity as Btn,
} from "react-native";
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function ObrasAdminScreen({ navigation }) {
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
      Alert.alert("⚠️ Error", "No se pudieron cargar las obras");
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
      {/* Botones de Acciones */}
      <View style={styles.actions}>
        <Btn
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("AsignarObrasScreen")}
        >
          <Text style={[styles.actionButtonText, { color: theme.text }]}>
            ➕ Asignar Obra
          </Text>
        </Btn>
        <Btn
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
          onPress={() => navigation.navigate("EliminarObrasScreen")}
        >
          <Text style={[styles.actionButtonText, { color: theme.text }]}>
            🗑️ Eliminar Obra
          </Text>
        </Btn>
      </View>

      {/* Listado de obras */}
      <Text style={[styles.title, { color: theme.text }]}>📋 Lista de Obras</Text>
      <FlatList
        data={obras}
        keyExtractor={(item) => item.id_obra.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() =>
              navigation.navigate("ObraDetailAdmin", { id_obra: item.id_obra })
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontWeight: "bold",
    fontSize: 15,
  },
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
