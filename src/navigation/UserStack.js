// app/navigation/UserStack.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeContext } from "../context/ThemeContext";

import UserHome from "../screens/user/home";
import UserObras from "../screens/user/obras";
import UserAsistencias from "../screens/user/asistencias";
import UserObrasDetail from "../screens/user/obras_detail";
import UserPerfil from "../screens/user/perfil";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary }, // 👈 color dinámico
        headerTintColor: "#fff", // texto/íconos en blanco para contraste
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="UserHome"
        component={UserHome}
        options={{ title: "Inicio" }}
      />
      <Stack.Screen
        name="Obras"
        component={UserObras}
        options={{ title: "Mis Obras" }}
      />
      <Stack.Screen
        name="ObraDetail"
        component={UserObrasDetail}
        options={{ title: "Detalle de Obra" }}
      />
      <Stack.Screen
        name="Asistencias"
        component={UserAsistencias}
        options={{ title: "Asistencias" }}
      />
      <Stack.Screen
        name="Perfil"
        component={UserPerfil}
        options={{ title: "Mi Perfil" }}
      />
    </Stack.Navigator>
  );
}
