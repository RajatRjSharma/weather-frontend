export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  humidity: number;
  // Add other fields as needed
}

export interface CurrentWeatherData {
  weather: WeatherCondition[];
  main: MainWeatherInfo;
  name: string;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherInfo;
  weather: WeatherCondition[];
}

export interface ForecastData {
  list: ForecastItem[];
}
