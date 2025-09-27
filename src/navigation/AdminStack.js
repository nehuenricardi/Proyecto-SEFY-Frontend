// app/navigation/AdminStack.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeContext } from "../context/ThemeContext";

// 📌 Pantallas del administrador
import AdminHome from "../screens/admin/home";
import TomarAsistenciaScreen from "../screens/admin/asistencia/tomar_asistencia";
import ObrasScreen from "../screens/admin/obras/obras";
import UsuariosScreen from "../screens/admin/usuarios";
import PerfilScreen from "../screens/admin/perfil";
import AdministrarUsuarioScreen from "../screens/admin/administrar_usuario";
import ObrasDetailScreen from "../screens/admin/obras/obras_detail";
import AsignarObrasScreen from "../screens/admin/obras/asignar_obras";
import EliminarObrasScreen from "../screens/admin/obras/eliminar_obra";
import ObraAsignacionScreen from "../screens/admin/obras/obra_asignacion";
import AsistenciaUsuariosScreen from "../screens/admin/asistencia/administrar_asistencia_usuario";
import AdministrarAsistenciaScreen from "../screens/admin/asistencia/administrar_asistencia";
import ModificarAsistencia from "../screens/admin/asistencia/modificar_asistencia";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary }, // 👈 dinámico según el tema
        headerTintColor: "#fff", // texto/íconos en blanco
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: "Panel de Administrador" }}
      />
      <Stack.Screen
        name="TomarAsistencia"
        component={TomarAsistenciaScreen}
        options={{ title: "Tomar Asistencia" }}
      />
      <Stack.Screen
        name="Obras"
        component={ObrasScreen}
        options={{ title: "Gestión de Obras" }}
      />
      <Stack.Screen
        name="Usuarios"
        component={UsuariosScreen}
        options={{ title: "Gestión de Usuarios" }}
      />
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />
      <Stack.Screen
        name="AdministrarUsuario"
        component={AdministrarUsuarioScreen}
        options={{ title: "Administrar Usuario" }}
      />
      <Stack.Screen
        name="ObraDetailAdmin"
        component={ObrasDetailScreen}
        options={{ title: "Detalle de Obra" }}
      />
      <Stack.Screen
        name="AsignarObrasScreen"
        component={AsignarObrasScreen}
        options={{ title: "Asignar Obras" }}
      />
      <Stack.Screen
        name="EliminarObrasScreen"
        component={EliminarObrasScreen}
        options={{ title: "Eliminar Obras" }}
      />
      <Stack.Screen
        name="ObraAsignacionScreen"
        component={ObraAsignacionScreen}
        options={{ title: "Asignaciones de Obra" }}
      />
      <Stack.Screen
        name="AdministrarAsistenciaUsuario"
        component={AsistenciaUsuariosScreen}
        options={{ title: "Ver Usuarios" }}
      />
      <Stack.Screen
        name="AdministrarAsistencia"
        component={AdministrarAsistenciaScreen}
        options={{ title: "Administrar Asistencia" }}
      />
      <Stack.Screen
        name="ModificarAsistencia"
        component={ModificarAsistencia}
        options={{ title: "Modificar Asistencia" }}
      />
    </Stack.Navigator>
  );
}
