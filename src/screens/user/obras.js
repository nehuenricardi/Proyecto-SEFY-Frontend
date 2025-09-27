// app/user/obras.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";

export default function ObrasScreen({ navigation }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);
  const nav = useNavigation();

  // 🔹 Configurar el header con el tema
  useEffect(() => {
    nav.setOptions({
      title: "Mis Obras",
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [theme, nav]);

  useEffect(() => {
    const fetchMisObras = async () => {
      try {
        const res = await api.get("/me/obras");
        setObras(res.data);
      } catch (err) {
        console.error("❌ Error cargando obras asignadas:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMisObras();
  }, []);

  if (loading) return <Loader/>;

  return (
    <FlatList
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 15, paddingBottom: 24 }}
      data={obras}
      keyExtractor={(item) => item.id_obra.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ObraDetail", { id: item.id_obra })}
          activeOpacity={0.7}
        >
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {item.nombre_obra || item.nombre}
            </Text>
            <Text style={[styles.info, { color: theme.text }]}>
              {item.direccion}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20, color: theme.secondary }}>
          No tenés obras asignadas.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
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
  },
});
