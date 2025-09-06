import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Login from "../components/Login";

const LoginWrapper = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  return (
    <Login
      onLoginSuccess={login}
      onSwitchToRegister={() => navigate("/register")}
    />
  );
};

export default LoginWrapper;
