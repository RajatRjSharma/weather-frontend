import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";
import Login from "../components/Login.js";

const LoginWrapper = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Update login to accept tokens
  const handleLoginSuccess = (accessToken: string, refreshToken: string) => {
    login(accessToken, refreshToken);
  };

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onSwitchToRegister={() => navigate("/register")}
    />
  );
};

export default LoginWrapper;
