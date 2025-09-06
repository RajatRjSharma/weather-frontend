import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Simple in-memory cache example (expand as needed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

// Store responses in cache
api.interceptors.response.use(
  (response) => {
    if (response.config.method === "get") {
      cache.set(
        response.config.url + JSON.stringify(response.config.params),
        response
      );
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 304 and return cached response
api.interceptors.response.use(undefined, (error) => {
  const { response, config } = error;
  if (response && response.status === 304 && config.method === "get") {
    const cachedResponse = cache.get(
      config.url + JSON.stringify(config.params)
    );
    if (cachedResponse) {
      return Promise.resolve(cachedResponse);
    }
  }
  return Promise.reject(error);
});

export function setupInterceptors(onAuthError: () => void) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        if (
          status === 401 ||
          (status === 400 &&
            error.response.data?.message?.includes(
              "accessToken cookie missing"
            ))
        ) {
          onAuthError();
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
