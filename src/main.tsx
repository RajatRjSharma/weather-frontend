import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { AuthProvider } from "./context/authContext.js";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename="/weather-frontend">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
