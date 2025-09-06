import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development, production)
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/weather-frontend/',
    plugins: [react()],
    server: {
      proxy: {
        // Proxy requests starting with /api to backend URL
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
