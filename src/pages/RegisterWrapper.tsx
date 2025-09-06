import { useNavigate } from "react-router-dom";
import Register from "../components/Register";
import { useAuth } from "../context/authContext";
import React from "react";

const RegisterWrapper = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  // Navigate to login page after successful registration
  const handleRegisterSuccess = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => navigate("/login")}
    />
  );
};

export default RegisterWrapper;
