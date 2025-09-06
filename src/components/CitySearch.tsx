import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface City {
  name: string;
  countryName: string;
  adminName1?: string;
  lat: string;
  lng: string;
}

interface CitySearchProps {
  cityOptions: City[];
  loading: boolean;
  onInputChange: (value: string) => void;
  onCitySelect: (city: City | null) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({
  cityOptions,
  loading,
  onInputChange,
  onCitySelect,
}) => (
  <Autocomplete
    options={cityOptions}
    getOptionLabel={(option) =>
      `${option.name}, ${option.adminName1 || ""}, ${option.countryName}`
    }
    loading={loading}
    onInputChange={(_, value) => onInputChange(value)}
    onChange={(_, newVal) => onCitySelect(newVal)}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Search city"
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />
);

export default CitySearch;
