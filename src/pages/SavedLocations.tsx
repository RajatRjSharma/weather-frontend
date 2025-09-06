import { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SavedLocations = () => {
  const [savedCities, setSavedCities] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedCities");
      if (saved) setSavedCities(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to load saved cities", error);
    }
  }, []);

  const openCity = (cityName: string) => {
    navigate("/dashboard", { state: { cityName } });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Saved Locations
      </Typography>

      {savedCities.length === 0 ? (
        <Typography>No saved locations yet.</Typography>
      ) : (
        <List>
          {savedCities.map((city, i) => (
            <ListItem
              key={`${city}-${i}`}
              component="div"
              onClick={() => openCity(city)}
              sx={{ textAlign: "left", cursor: "pointer" }}
            >
              <ListItemText primary={city} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SavedLocations;
