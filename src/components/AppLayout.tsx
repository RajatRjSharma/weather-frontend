import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { UserProfile } from "../types/auth";

interface City {
  id?: string;
  name: string;
  countryName: string;
  adminName1?: string;
  lat: string;
  lng: string;
}

interface AppLayoutProps {
  savedCities: City[];
  onSelectCity: (city: City) => void;
  onRemoveCity: (cityId: string) => void;
  onLogout: () => void;
  user: UserProfile | null;
  children: React.ReactNode;

  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const drawerWidth = 280;

const AppLayout: React.FC<AppLayoutProps> = ({
  savedCities,
  onSelectCity,
  onRemoveCity,
  onLogout,
  user,
  children,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <Header
        onMenuToggle={handleDrawerToggle}
        user={user}
        onLogout={onLogout}
      />
      <Sidebar
        savedCities={savedCities}
        onSelectCity={onSelectCity}
        onRemoveCity={onRemoveCity}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        currentPage={currentPage || 1}
        totalPages={totalPages || 1}
        onPageChange={onPageChange || (() => {})}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          ml: { sm: `${drawerWidth}px` },
          mt: { xs: 9, sm: 10 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
