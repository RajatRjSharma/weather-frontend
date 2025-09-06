import api from "./axios"; // your configured axios instance

// City Search with autocomplete query
export const searchCities = async (query: string) => {
  const response = await api.get("/cities/list", { params: { query } });
  return response.data.data; // destructure as per backend response shape
};

// Current weather for city
export const getCurrentWeather = async (city: string) => {
  const response = await api.get("/weather/current", { params: { city } });
  return response.data;
};

// 5-day forecast
export const getFiveDayForecast = async (city: string) => {
  const response = await api.get("/weather/forecast", { params: { city } });
  return response.data;
};

// Nearby attractions by lat/lon
export const getNearbyAttractions = async (
  lat: number,
  lon: number,
  radius = 1000
) => {
  const response = await api.get("/other/attractions/nearby", {
    params: { lat, lon, radius },
  });
  return response.data;
};

// Local news by country code
export const getLocalNews = async (countryCode: string) => {
  const response = await api.get("/other/news/headlines", {
    params: { country: countryCode },
  });
  return response.data;
};
