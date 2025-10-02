// src/screens/admin/administrar_usuario.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import api from "../../api/api";
import Loader from "../../components/Loader";
import { ThemeContext } from "../../context/ThemeContext";

// 👉 util de errores (consistente con login/register)
function showApiError(err, entity = "usuario") {
  const isAxiosErr = !!(err && (err.isAxiosError || err.response || err.request || err.code));

  if (!isAxiosErr) {
    console.error("Error no Axios:", err);
    Alert.alert("Error", "Ocurrió un error inesperado. Intentá nuevamente.");
    return;
  }

  if (err.code === "ECONNABORTED" || /timeout/i.test(err.message || "")) {
    Alert.alert("Tiempo de espera agotado", "El servidor no respondió a tiempo.");
    return;
  }

  if (err.request && !err.response) {
    console.error("Sin respuesta del servidor:", err.message);
    Alert.alert("Sin conexión con el servidor", "Verificá tu Internet o el backend.");
    return;
  }

  const status = err.response?.status;
  const detail =
    err.response?.data?.detail ||
    err.response?.data?.message ||
    (typeof err.response?.data === "string" ? err.response.data : null);

  if (status === 400) {
    Alert.alert("Datos inválidos", detail || `Revisá los campos del ${entity}.`);
    return;
  }
  if (status === 401) {
    Alert.alert("No autorizado", detail || "Volvé a iniciar sesión.");
    return;
  }
  if (status === 403) {
    Alert.alert("Acceso denegado", detail || "No tenés permisos.");
    return;
  }
  if (status === 404) {
    Alert.alert("No encontrado", detail || `El ${entity} no existe.`);
    return;
  }
  if (status === 409) {
    Alert.alert("Conflicto", detail || "Conflicto con datos existentes.");
    return;
  }
  if (status === 422) {
    Alert.alert("Datos inválidos", detail || "Algunos campos no cumplen el formato requerido.");
    return;
  }
  if (status === 429) {
    Alert.alert("Demasiadas solicitudes", detail || "Probá nuevamente más tarde.");
    return;
  }
  if (status >= 500) {
    Alert.alert("Error del servidor", detail || "Problema del lado del servidor.");
    return;
  }

  Alert.alert("Error", detail || "Ocurrió un error. Intentá nuevamente.");
}

export default function AdministrarUsuarioScreen({ route, navigation }) {
  const { dni } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { theme } = useContext(ThemeContext);

  // estados editables
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/usuarios/${dni}`);
        const data = res.data;
        setUsuario(data);

        setNombre(data.nombre || "");
        setApellido(data.apellido || "");
        setTelefono(data.telefono || "");
        setEmail(data.email ?? data.mail ?? "");
        setDireccion(data.direccion || "");
        setEsAdmin(!!data.es_admin);
      } catch (err) {
        console.error("❌ Error cargando usuario:", err.response?.data || err.message);
        showApiError(err, "usuario");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [dni, navigation]);

  const handleGuardar = async () => {
    if (!usuario) {
      Alert.alert("Error", "No se pudo cargar el usuario.");
      return;
    }

    // Normalizar inputs del form
    const nom = (nombre || "").trim();              // se envía aunque esté bloqueado
    const ape = (apellido || "").trim();
    const telInput = (telefono || "").trim();
    const emlInput = (email || "").trim().toLowerCase();
    const dirInput = (direccion || "").trim();

    // Evitar enviar null que pisen valores si el backend no tolera None.
    // Si el campo quedó vacío, mandamos el valor actual del usuario.
    const telefonoFinal =
      telInput.length > 0 ? telInput : (usuario.telefono ?? null);

    const emailActual = usuario.email ?? usuario.mail ?? null;
    const emailFinal =
      emlInput.length > 0 ? emlInput : emailActual;

    const direccionFinal =
      dirInput.length > 0 ? dirInput : (usuario.direccion ?? null);

    const payload = {
      dni,                            // requerido por UsuarioCreate
      nombre: nom,                    // bloqueado en UI, pero se envía
      apellido: ape,
      telefono: telefonoFinal,
      email: emailFinal,
      direccion: direccionFinal,
      es_admin: !!esAdmin,
    };

    // Validación mínima
    if (!payload.nombre || !payload.apellido) {
      Alert.alert("Faltan datos", "El nombre y apellido son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      const res = await api.put(`/usuarios/${dni}`, payload);
      setUsuario(res.data);
      Alert.alert("✅ Éxito", "Usuario actualizado correctamente");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error actualizando:", err.response?.data || err.message);
      showApiError(err, "usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = () => {
    Alert.alert("⚠️ Confirmar", "¿Seguro que deseas eliminar este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await api.delete(`/usuarios/${dni}`);
            Alert.alert("✅ Éxito", "Usuario eliminado correctamente");
            navigation.goBack();
          } catch (err) {
            console.error("❌ Error eliminando:", err.response?.data || err.message);
            showApiError(err, "usuario");
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  if (loading) return <Loader />;

  const inputsDisabled = saving || deleting;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>👤 Administrar Usuario</Text>
      <Text style={[styles.subtitle, { color: theme.secondary }]}>DNI: {dni}</Text>

      {/* Nombre solo lectura (bloqueado) */}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.primary,
            color: theme.text,
            opacity: 0.6,
          },
        ]}
        placeholder="Nombre"
        placeholderTextColor={theme.secondary}
        value={nombre}
        editable={false}
      />

      {/* Apellido editable */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text, opacity: inputsDisabled ? 0.6 : 1 },
        ]}
        placeholder="Apellido"
        placeholderTextColor={theme.secondary}
        value={apellido}
        onChangeText={setApellido}
        editable={!inputsDisabled}
      />

      {/* Teléfono */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text, opacity: inputsDisabled ? 0.6 : 1 },
        ]}
        placeholder="Teléfono"
        placeholderTextColor={theme.secondary}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        editable={!inputsDisabled}
      />

      {/* Email */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text, opacity: inputsDisabled ? 0.6 : 1 },
        ]}
        placeholder="Email"
        placeholderTextColor={theme.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!inputsDisabled}
      />

      {/* Dirección */}
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.primary, color: theme.text, opacity: inputsDisabled ? 0.6 : 1 },
        ]}
        placeholder="Dirección"
        placeholderTextColor={theme.secondary}
        value={direccion}
        onChangeText={setDireccion}
        editable={!inputsDisabled}
      />

      {/* Toggle de Administrador */}
      <View
        style={[
          styles.adminRow,
          {
            backgroundColor: theme.card,
            borderColor: theme.primary,
            opacity: inputsDisabled ? 0.6 : 1,
          },
        ]}
      >
        <Text style={[styles.adminLabel, { color: theme.text }]}>👑 Administrador</Text>
        <Switch
          value={esAdmin}
          onValueChange={setEsAdmin}
          trackColor={{ false: "#aaaaaa", true: theme.primary }}
          thumbColor={esAdmin ? theme.secondary : "#f4f3f4"}
          disabled={inputsDisabled}
        />
      </View>

      {/* Botón guardar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary, opacity: saving ? 0.7 : 1 }]}
        onPress={handleGuardar}
        disabled={inputsDisabled}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {saving ? "Guardando..." : "💾 Guardar cambios"}
        </Text>
      </TouchableOpacity>

      {/* Botón eliminar */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.secondary, marginTop: 10, opacity: deleting ? 0.7 : 1 },
        ]}
        onPress={handleEliminar}
        disabled={inputsDisabled}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {deleting ? "Eliminando..." : "🗑️ Eliminar usuario"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  adminRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  adminLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
