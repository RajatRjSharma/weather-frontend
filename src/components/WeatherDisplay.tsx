import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Grid,
} from "@mui/material";

interface WeatherDescription {
  main: string;
  description: string;
  icon: string;
}

interface CurrentWeatherData {
  name: string;
  weather: WeatherDescription[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface ForecastItem {
  dt: number;
  temp: {
    day: number;
    night: number;
  };
  weather: WeatherDescription[];
}

interface ForecastData {
  list: ForecastItem[];
}

interface CityDetails {
  name: string;
  country: string;
  // add more fields if needed like adminName, etc.
}

interface WeatherDisplayProps {
  current: CurrentWeatherData;
  forecast: ForecastData;
  cityDetails?: CityDetails; // new optional prop to pass city info
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  current,
  forecast,
  cityDetails,
}) => {
  const theme = useTheme();

  const currentWeather = current.weather[0];

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box>
      {/* Current Weather Section */}
      <Card raised sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexGrow: 1,
              width: { xs: "100%", sm: "33.33%" }, // roughly xs=12, sm=4 equivalents
            }}
          >
            <CardMedia
              component="img"
              image={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
              alt={currentWeather.description}
              sx={{ width: 120, height: 120 }}
            />
            <Typography variant="h6" textTransform="capitalize" sx={{ mt: 1 }}>
              {currentWeather.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              flexGrow: 1,
              width: { xs: "100%", sm: "33.33%" }, // roughly xs=12, sm=4 equivalents
            }}
          >
            {cityDetails && (
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {cityDetails.name}, {cityDetails.country}
              </Typography>
            )}
            <Typography variant="h4" gutterBottom>
              {current.name}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {Math.round(current.main.temp)}°C
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Feels like: {Math.round(current.main.feels_like)}°C
            </Typography>
            <Typography variant="body1">
              Humidity: {current.main.humidity}%
            </Typography>
            <Typography variant="body1">
              Pressure: {current.main.pressure} hPa
            </Typography>
            <Typography variant="body1">
              Wind Speed: {current.wind.speed} m/s
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Sunrise: {sunrise}
            </Typography>
            <Typography variant="body1">Sunset: {sunset}</Typography>
          </Box>
        </Grid>
      </Card>

      {/* Forecast Section */}
      <Typography variant="h5" gutterBottom>
        5-Day Forecast
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          pb: 2,
          gap: 2,
          p: 2,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
          },
        }}
      >
        {forecast.list
          .filter((_, idx) => idx % 8 === 0) // roughly one per day
          .map((item, idx) => {
            const date = new Date(item.dt * 1000);
            const dayOfWeek = date.toLocaleDateString(undefined, {
              weekday: "short",
            });
            const day = date.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
            });
            const weather = item.weather[0];

            return (
              <Card
                key={idx}
                raised
                sx={{
                  minWidth: 140,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  backgroundColor: theme.palette.background.paper,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  sx={{ width: 60, height: 60, mb: 1 }}
                />
                <CardContent sx={{ p: 0, width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {dayOfWeek}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    fontSize="0.8rem"
                    textAlign="center"
                    gutterBottom
                  >
                    {day}
                  </Typography>
                  <Typography
                    variant="body1"
                    textTransform="capitalize"
                    textAlign="center"
                    gutterBottom
                  >
                    {weather.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 1,
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Day: {Math.round(item.temp.day)}°C
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Night: {Math.round(item.temp.night)}°C
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
      </Box>
    </Box>
  );
};

export default WeatherDisplay;
