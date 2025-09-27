// src/screens/admin/administrar_asistencia.js
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

export default function AdministrarAsistenciaScreen({ route, navigation }) {
  const { dni } = route.params;
  const [asistencias, setAsistencias] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get(`/usuarios/${dni}`);
        setUsuario(userRes.data);

        const res = await api.get("/asistencias/");
        const asistenciasUsuario = res.data.filter((a) => a.dni_usuario === dni);
        setAsistencias(asistenciasUsuario);
      } catch (err) {
        console.error("❌ Error cargando datos:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dni]);

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        📋 Asistencias de{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellido}` : dni}
      </Text>

      <FlatList
        data={asistencias}
        keyExtractor={(item) => item.id_asistencia.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() =>
              navigation.navigate("ModificarAsistencia", { asistencia: item })
            }
          >
            <Text style={[styles.itemTitle, { color: theme.text }]}>
              📅 Día: {item.dia}
            </Text>
            <Text style={{ color: theme.text }}>Estado: {item.estado}</Text>
            <Text style={{ color: theme.text }}>Asignación: {item.id_asignacion}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.secondary }]}>
            No hay asistencias registradas para este usuario.
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
