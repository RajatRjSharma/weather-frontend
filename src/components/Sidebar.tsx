import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Drawer,
  useTheme,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface City {
  id?: string;
  name: string;
  countryName: string;
  adminName1?: string;
  lat: string;
  lng: string;
}

interface SidebarProps {
  savedCities: City[];
  onSelectCity: (city: City) => void;
  onRemoveCity: (cityId: string) => void;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const drawerWidth = 280;

const Sidebar: React.FC<SidebarProps> = ({
  savedCities,
  onSelectCity,
  onRemoveCity,
  mobileOpen,
  handleDrawerToggle,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        p: 2,
        pt: { xs: 9, sm: 10 },
        bgcolor: "background.paper",
        minHeight: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 2,
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          pb: 1,
          mb: 2,
        }}
      >
        Saved Cities
      </Typography>

      {savedCities.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          No saved cities
        </Typography>
      ) : (
        <List sx={{ flexGrow: 1 }}>
          {savedCities.map((city) => (
            <ListItem
              key={city.id || city.name}
              component="div"
              onClick={() => {
                onSelectCity(city);
                if (isMobile) handleDrawerToggle();
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={`remove ${city.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (city.id) onRemoveCity(city.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ textAlign: "left", cursor: "pointer" }}
            >
              <ListItemText primary={city.name} />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
              onPageChange(value)
            }
          />
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
