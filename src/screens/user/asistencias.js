// app/user/asistencias.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";

export default function AsistenciasScreen() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  // 👇 Header temático y título “Asistencias”
  useEffect(() => {
    navigation.setOptions({
      title: "Asistencias",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff", // texto/íconos del header
    });
  }, [theme, navigation]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const meRes = await api.get("/me");
        const dniUsuario = meRes.data.dni;

        const asistenciasRes = await api.get("/asistencias/");
        const asistenciasUsuario = asistenciasRes.data.filter(
          (a) => a.dni_usuario === dniUsuario
        );

        const asistenciasConObra = await Promise.all(
          asistenciasUsuario.map(async (a) => {
            try {
              const asignacionRes = await api.get(`/asignaciones/${a.id_asignacion}`);
              const obraRes = await api.get(`/obras/${asignacionRes.data.id_obra}`);
              return {
                ...a,
                obra_nombre: obraRes.data.nombre_obra,
                obra_direccion: obraRes.data.direccion,
              };
            } catch (err) {
              console.error("⚠️ Error cargando obra de la asistencia:", err.message);
              return { ...a, obra_nombre: "Obra desconocida", obra_direccion: "" };
            }
          })
        );

        setAsistencias(asistenciasConObra);
      } catch (err) {
        console.error("❌ Error cargando asistencias:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  if (loading) return <Loader/>;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 15, paddingBottom: 24 }}
      data={asistencias}
      keyExtractor={(item) => item.id_asistencia.toString()}
      // 👇 Título dentro del listado (opcional, visual)
      ListHeaderComponent={
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, { color: theme.text }]}>Asistencias</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>📅 Día: {item.dia}</Text>
          <Text style={[styles.info, { color: theme.text }]}>Estado: {item.estado}</Text>
          <Text style={[styles.info, { color: theme.text }]}>Obra: {item.obra_nombre}</Text>
          <Text style={[styles.info, { color: theme.text }]}>Dirección: {item.obra_direccion}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20, color: theme.secondary }}>
          No tenés asistencias registradas.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    fontSize: 15,
    marginBottom: 4,
  },
});
