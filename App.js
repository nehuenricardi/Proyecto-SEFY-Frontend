// App.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import Loader from "./src/components/Loader";

// Stacks
import AuthStack from "./src/navigation/AuthStack";
import UserStack from "./src/navigation/UserStack";
import AdminStack from "./src/navigation/AdminStack";

function AppNavigator() {
  const { token, loading, user } = useContext(AuthContext);

  if (loading) return <Loader/>;

  return !token ? (
    <AuthStack />
  ) : user?.es_admin ? (
    <AdminStack />
  ) : (
    <UserStack />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
