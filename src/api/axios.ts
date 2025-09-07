import axios from "axios";

// Token storage variables managed externally (e.g., in React context)
let accessToken = "";
let refreshToken = "";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // No withCredentials needed when sending tokens manually via headers
});

// Request interceptor adds Authorization and refresh-token headers, plus optional CSRF
api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Add refresh token header on refresh-token requests
  if (refreshToken && config.url?.includes("/refresh-token")) {
    config.headers["x-refresh-token"] = refreshToken;
  }

  // Optional CSRF token header from cookie, if you still require CSRF protection
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (csrfToken && config.method !== "get") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (config.headers && typeof (config.headers as any).set === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config.headers as any).set("X-XSRF-TOKEN", csrfToken);
    } else if (config.headers) {
      (config.headers as Record<string, string>)["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  return config;
});

// Simple in-memory cache for GET responses (optional)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();

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
    const { response, config } = error;

    // Return cached response on HTTP 304
    if (response && response.status === 304 && config.method === "get") {
      const cachedResponse = cache.get(
        config.url + JSON.stringify(config.params)
      );
      if (cachedResponse) {
        return Promise.resolve(cachedResponse);
      }
    }

    // Enhanced error unwrapping: if backend provides message in response data, use it
    if (response && response.data && typeof response.data === "object") {
      const backendMessage = response.data.message;
      if (backendMessage) {
        // Create a custom error with backend message
        const customError = new Error(backendMessage);
        return Promise.reject(customError);
      }
    }

    return Promise.reject(error);
  }
);

// Setup response interceptor to detect auth errors and trigger onAuthError callback
export function setupInterceptors(onAuthError: () => void) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        if (
          status === 401 ||
          (status === 400 &&
            error.response.data?.message?.includes("accessToken missing"))
        ) {
          onAuthError();
        }
      }
      return Promise.reject(error);
    }
  );
}

// Functions to manage tokens externally (e.g., from React context)
export function setTokens(at: string, rt: string) {
  accessToken = at;
  refreshToken = rt;
}

export function clearTokens() {
  accessToken = "";
  refreshToken = "";
}

export default api;
