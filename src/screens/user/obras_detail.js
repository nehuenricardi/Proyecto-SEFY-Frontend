// app/user/obras_detail.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import Loader from "../../components/Loader";

export default function ObraDetailScreen({ route }) {
  const { id } = route.params;
  const { token } = useContext(AuthContext); // el token lleva el dni en "sub"
  const { theme } = useContext(ThemeContext);

  const [obra, setObra] = useState(null);
  const [asignacion, setAsignacion] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  // 🔹 Header dinámico
  useEffect(() => {
    navigation.setOptions({
      title: "Detalle de Obra",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [theme, navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Datos de la obra
        const obraRes = await api.get(`/obras/${id}`);
        setObra(obraRes.data);

        // 2️⃣ Buscar la asignación del usuario en esa obra
        const asignacionesRes = await api.get("/asignaciones/");
        const asign = asignacionesRes.data.find(
          (a) =>
            a.id_obra === id &&
            (a.dni_usuario === token?.dni || a.dni_usuario === token)
        );
        setAsignacion(asign);
      } catch (err) {
        console.error(
          "❌ Error cargando detalle de obra:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) return <Loader/>;

  if (!obra) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.text }]}>
          No se pudo cargar la obra.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {obra.nombre_obra}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Dirección: {obra.direccion}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Fecha de inicio: {obra.fecha_inicio || "No definida"}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Fecha de fin: {obra.fecha_fin || "No definida"}
        </Text>
        <Text style={[styles.info, { color: theme.text }]}>
          Estado: {obra.estado}
        </Text>

        {asignacion && (
          <View style={[styles.subCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.subtitle, { color: theme.primary }]}>
              📋 Tu asignación:
            </Text>
            <Text style={[styles.info, { color: theme.text }]}>
              Rol: {asignacion.rol_empleado}
            </Text>
            <Text style={[styles.info, { color: theme.text }]}>
              Fecha asignación: {asignacion.fecha_asignacion}
            </Text>
            <Text style={[styles.info, { color: theme.text }]}>
              Activo: {asignacion.activo ? "Sí" : "No"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  subCard: {
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
});
