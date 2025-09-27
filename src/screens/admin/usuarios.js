// src/screens/admin/usuarios.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";

export default function UsuariosAdminScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios/");
      setUsuarios(res.data);
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err.response?.data || err.message);
      Alert.alert("⚠️ Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>👥 Lista de Usuarios</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.dni}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() =>
              navigation.navigate("AdministrarUsuario", { dni: item.dni })
            }
            activeOpacity={0.7}
          >
            <Text style={[styles.itemTitle, { color: theme.text }]}>
              {item.nombre} {item.apellido}
            </Text>
            <Text style={{ color: theme.text }}>📧 {item.email}</Text>
            <Text style={{ color: theme.text }}>🆔 DNI: {item.dni}</Text>
            <Text style={{ color: theme.text }}>
              ⚡ Admin: {item.es_admin ? "✅ Sí" : "❌ No"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondary }]}>
            No hay usuarios registrados.
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
    marginBottom: 15,
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  empty: { textAlign: "center", marginTop: 20, fontStyle: "italic" },
});
