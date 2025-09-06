import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Pagination,
} from "@mui/material";

interface AttractionFeature {
  id: string;
  properties: {
    name?: string;
    dist: number;
    rate: number;
    kinds?: string;
  };
}

interface AttractionsListProps {
  features: AttractionFeature[];
}

const ITEMS_PER_PAGE = 10;

const AttractionsList: React.FC<AttractionsListProps> = ({ features }) => {
  const [page, setPage] = useState(1);

  const count = Math.ceil(features.length / ITEMS_PER_PAGE);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedFeatures = features.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <List>
        {paginatedFeatures.map(({ id, properties }) => (
          <React.Fragment key={id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {properties.name ?? "Unknown"}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: "inline" }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="span"
                      sx={{ display: "block" }}
                    >
                      Distance: {properties.dist.toFixed(0)} m
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="span"
                      sx={{ display: "block" }}
                    >
                      Rating: {properties.rate} / 6
                    </Typography>
                    {properties.kinds && (
                      <Box
                        component="span"
                        sx={{
                          mt: 0.5,
                          display: "inline-flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          verticalAlign: "middle",
                        }}
                      >
                        {properties.kinds.split(",").map((kind) => (
                          <Chip key={kind} label={kind} size="small" />
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      {count > 1 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Pagination count={count} page={page} onChange={handleChange} />
        </Box>
      )}
    </Box>
  );
};

export default AttractionsList;
