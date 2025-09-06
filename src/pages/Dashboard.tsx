import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import AppLayout from "../components/AppLayout.js";
import CitySearch from "../components/CitySearch.js";
import useCurrentLocation from "../hooks/useCurrentLocation.js";
import api from "../api/axios.js";
import { useAuth } from "../context/authContext.js";
import WeatherDisplay from "../components/WeatherDisplay.js";
import AttractionsList from "../components/AttractionsList.js";
import NewsList from "../components/NewsList.js";
import { Skeleton } from "@mui/material";

interface City {
  id?: string;
  name: string;
  countryName: string;
  adminName1?: string;
  lat: string;
  lng: string;
}

interface WeatherDescription {
  main: string;
  description: string;
  icon: string;
}

interface Weather {
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

interface ForecastDay {
  dt: number;
  temp: { day: number; night: number };
  weather: WeatherDescription[];
}

interface AttractionFeature {
  id: string;
  properties: {
    name?: string;
    dist: number;
    rate: number;
    kinds?: string;
  };
}

interface NewsArticle {
  title: string;
  source?: { name?: string };
  publishedAt: string;
  description?: string;
  url?: string;
}

interface ApiWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface ApiForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    humidity: number;
    temp_kf?: number;
  };
  weather: ApiWeather[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop?: number;
  rain?: { "3h": number };
  sys: { pod: string };
  dt_txt: string;
}

const Dashboard = () => {
  const { location: currentLocation, error: locationError } =
    useCurrentLocation();
  const { user, logout } = useAuth();

  const [cityQuery, setCityQuery] = useState("");
  const [cityOptions, setCityOptions] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [savedCities, setSavedCities] = useState<City[]>([]);
  const [savedCitiesPage, setSavedCitiesPage] = useState(1);
  const [savedCitiesLimit] = useState(10);
  const [savedCitiesNoOfPage, setSavedCitiesNoOfPage] = useState(1);

  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [attractions, setAttractions] = useState<AttractionFeature[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedCities = async (
    savedCitiesPage: number,
    savedCitiesLimit: number
  ) => {
    try {
      const res = await api.get("/savedCities", {
        params: { page: savedCitiesPage, limit: savedCitiesLimit },
      });
      setSavedCities(res.data.data);
      setSavedCitiesNoOfPage(Math.ceil(res.data.total / savedCitiesLimit));
      console.log(res.data.data);
    } catch (err) {
      console.error("Failed to load saved cities", err);
      setSavedCities([]);
    }
  };

  useEffect(() => {
    fetchSavedCities(savedCitiesPage, savedCitiesLimit);
  }, [savedCitiesPage, savedCitiesLimit]);

  useEffect(() => {
    setSavedCitiesPage(1);
  }, []);

  useEffect(() => {
    if (!cityQuery) {
      setCityOptions([]);
      return;
    }
    let active = true;
    setLoadingCities(true);

    api
      .get("/cities/list", { params: { query: cityQuery } })
      .then((res) => {
        if (active) setCityOptions(res.data.data);
      })
      .catch(() => {
        if (active) setCityOptions([]);
      })
      .finally(() => {
        if (active) setLoadingCities(false);
      });

    return () => {
      active = false;
    };
  }, [cityQuery]);

  useEffect(() => {
    const loadCurrentCityFromLocation = async () => {
      if (!currentLocation || selectedCity) return;

      try {
        const res = await api.get("/cities/reverse-geocode", {
          params: { lat: currentLocation.lat, lng: currentLocation.lon },
        });
        const cityFromLocation: City = res.data.data;
        setSelectedCity(cityFromLocation);
      } catch {
        setError("Unable to determine your city from current location");
      }
    };

    loadCurrentCityFromLocation();
  }, [currentLocation, selectedCity]);

  useEffect(() => {
    if (!selectedCity) return;

    console.log(selectedCity);

    const loadData = () => {
      // Reset errors and set all loading flags to true
      setError(null);
      setLoadingWeather(true);
      setLoadingForecast(true);
      setLoadingAttractions(true);
      setLoadingNews(true);

      console.log(selectedCity);

      // Load current weather
      api
        .get("/weather/current", {
          params: { lat: selectedCity.lat, lon: selectedCity.lng },
        })
        .then((res) => setWeather(res.data))
        .catch((err) => {
          console.error(err);
          setWeather(null);
        })
        .finally(() => setLoadingWeather(false));

      // Load forecast
      api
        .get("/weather/forecast", {
          params: { lat: selectedCity.lat, lon: selectedCity.lng },
        })
        .then((res) => {
          const transformedForecast = res.data.list.map(
            (item: ApiForecastItem) => ({
              dt: item.dt,
              temp: { day: item.main.temp, night: item.main.temp },
              weather: item.weather.map((w: ApiWeather) => ({
                main: w.main,
                description: w.description,
                icon: w.icon,
              })),
            })
          );
          setForecast(transformedForecast);
        })
        .catch((err) => {
          console.error(err);
          setForecast([]);
        })
        .finally(() => setLoadingForecast(false));

      // Load attractions
      api
        .get("/other/attractions/nearby", {
          params: { lat: selectedCity.lat, lon: selectedCity.lng },
        })
        .then((res) => setAttractions(res.data?.data?.features || []))
        .catch((err) => {
          console.error(err);
          setAttractions([]);
        })
        .finally(() => setLoadingAttractions(false));

      // Load news
      api
        .get("/other/news/headlines", {
          params: { country: selectedCity.countryName },
        })
        .then((res) => setNews(res.data?.data?.articles || []))
        .catch((err) => {
          console.error(err);
          setNews([]);
        })
        .finally(() => setLoadingNews(false));
    };

    loadData();
  }, [selectedCity]);

  const addCityToSaved = async () => {
    if (!selectedCity) return;
    try {
      await api.post("/savedCities", {
        name: selectedCity.name,
        countryName: selectedCity.countryName,
        adminName1: selectedCity.adminName1,
        lat: parseFloat(selectedCity.lat),
        lng: parseFloat(selectedCity.lng),
      });
      if (savedCitiesPage == 1) {
        fetchSavedCities(1, savedCitiesLimit);
      }
      setSavedCitiesPage(1);
    } catch (err) {
      console.error("Failed to save city", err);
    }
  };

  const handleRemoveSavedCity = async (cityId: string) => {
    try {
      await api.delete(`/savedCities/${cityId}`);
      if (savedCitiesPage == 1) {
        fetchSavedCities(1, savedCitiesLimit);
      }
      setSavedCitiesPage(1);
      if (selectedCity?.id === cityId) {
        setSelectedCity(null);
      }
    } catch (err) {
      console.error("Failed to remove saved city", err);
    }
  };

  const handleSelectSavedCity = (city: City) => {
    console.log(city);
    setSelectedCity(city);
  };

  return (
    <AppLayout
      savedCities={savedCities}
      onSelectCity={handleSelectSavedCity}
      onRemoveCity={handleRemoveSavedCity}
      user={user}
      onLogout={logout}
      currentPage={savedCitiesPage}
      totalPages={savedCitiesNoOfPage}
      onPageChange={(_) => setSavedCitiesPage(_)}
    >
      {/* Do NOT add marginLeft here. It is handled in AppLayout */}
      {locationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {locationError}
        </Alert>
      )}
      <CitySearch
        cityOptions={cityOptions}
        loading={loadingCities}
        onInputChange={setCityQuery}
        onCitySelect={setSelectedCity}
      />
      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          onClick={addCityToSaved}
          disabled={!selectedCity}
        >
          Save this Location
        </Button>
      </Box>

      {/* Show error alert if error exists */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Weather section */}
      {loadingWeather ? (
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 4,
            p: 2,
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <Skeleton variant="text" width={120} height={40} />
          <Skeleton
            variant="rectangular"
            width={80}
            height={80}
            sx={{ my: 1 }}
          />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
        </Box>
      ) : (
        weather &&
        forecast.length > 0 && (
          <WeatherDisplay
            current={weather}
            forecast={{ list: forecast }}
            cityDetails={{
              name: selectedCity?.name || "",
              country: selectedCity?.countryName || "",
            }}
          />
        )
      )}

      {/* Forecast section */}
      {loadingForecast ? (
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 4 }}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{ width: 120, p: 2, boxShadow: 1, borderRadius: 2 }}
            >
              <Skeleton
                variant="rectangular"
                width={80}
                height={60}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="70%" />
            </Box>
          ))}
        </Box>
      ) : null}

      {/* Attractions section */}
      <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nearby Attractions
        </Typography>
        {loadingAttractions ? (
          [...Array(3)].map((_, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={24}
                sx={{ mt: 1 }}
              />
            </Box>
          ))
        ) : attractions && attractions.length > 0 ? (
          <AttractionsList features={attractions} />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No attractions data available.
          </Typography>
        )}
      </Box>

      {/* News section */}
      <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Local News
        </Typography>
        {loadingNews ? (
          [...Array(3)].map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))
        ) : news && news.length > 0 ? (
          <NewsList articles={news} />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No news articles available.
          </Typography>
        )}
      </Box>
    </AppLayout>
  );
};

export default Dashboard;
