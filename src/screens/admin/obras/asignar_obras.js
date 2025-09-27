// src/screens/admin/asignar_obras.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../../api/api";
import Loader from "../../../components/Loader";
import { ThemeContext } from "../../../context/ThemeContext";

export default function AsignarObrasScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [obras, setObras] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [selectedObra, setSelectedObra] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await api.get("/usuarios/");
        const obrasRes = await api.get("/obras/");
        setUsuarios(usersRes.data);
        setObras(obrasRes.data);
      } catch (err) {
        console.error("❌ Error cargando datos:", err.response?.data || err.message);
        Alert.alert("Error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAsignar = async () => {
    if (!selectedUsuario || !selectedObra || !rol) {
      Alert.alert("⚠️ Error", "Seleccioná usuario, obra y rol");
      return;
    }

    try {
      await api.post("/asignaciones/", {
        dni_usuario: selectedUsuario,
        id_obra: parseInt(selectedObra),
        rol_empleado: rol,
      });

      Alert.alert("✅ Éxito", "Asignación creada correctamente");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error creando asignación:", err.response?.data || err.message);
      Alert.alert("⚠️ Error", "No se pudo crear la asignación");
    }
  };

  if (loading) return <Loader/>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>➕ Asignar Usuario a Obra</Text>

      <Text style={[styles.label, { color: theme.text }]}>Seleccionar Usuario</Text>
      <View style={[styles.pickerWrapper, { borderColor: theme.primary }]}>
        <Picker
          selectedValue={selectedUsuario}
          onValueChange={(itemValue) => setSelectedUsuario(itemValue)}
          dropdownIconColor={theme.primary}
          style={{ color: theme.text }}
        >
          <Picker.Item label="-- Seleccionar usuario --" value="" />
          {usuarios.map((u) => (
            <Picker.Item
              key={u.dni}
              label={`${u.nombre} ${u.apellido} (${u.dni})`}
              value={u.dni}
            />
          ))}
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Seleccionar Obra</Text>
      <View style={[styles.pickerWrapper, { borderColor: theme.primary }]}>
        <Picker
          selectedValue={selectedObra}
          onValueChange={(itemValue) => setSelectedObra(itemValue)}
          dropdownIconColor={theme.primary}
          style={{ color: theme.text }}
        >
          <Picker.Item label="-- Seleccionar obra --" value="" />
          {obras.map((o) => (
            <Picker.Item
              key={o.id_obra}
              label={`${o.nombre_obra} (${o.direccion})`}
              value={o.id_obra.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Rol del Usuario</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text, backgroundColor: theme.card },
        ]}
        value={rol}
        onChangeText={setRol}
        placeholder="Ej: Albañil, Ingeniero..."
        placeholderTextColor={theme.secondary}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleAsignar}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>✅ Crear Asignación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { marginTop: 10, fontWeight: "bold", marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});
