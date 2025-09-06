// src/App.tsx
import React from "react";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SavedLocations from "./pages/SavedLocations";
import PrivateRoute from "./components/PrivateRoute";
import LoginWrapper from "./pages/LoginWrapper";
import RegisterWrapper from "./pages/RegisterWrapper";
import { lightTheme, darkTheme } from "./theme";
import { setupInterceptors } from "./api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

function App() {
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");

  const { logout } = useAuth();

  React.useEffect(() => {
    setupInterceptors(() => {
      logout();
    });
  }, [navigate, logout]);

  const theme = React.useMemo(
    () => (prefersDarkMode ? darkTheme : lightTheme),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved-locations"
          element={
            <PrivateRoute>
              <SavedLocations />
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
