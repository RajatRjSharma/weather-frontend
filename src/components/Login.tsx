import React, { useState } from "react"; // import useState
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import api from "../api/axios.js";

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (accessToken: string, refreshToken: string) => void;
}

interface IFormInputs {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onLoginSuccess,
}) => {
  const [serverError, setServerError] = useState<string | null>(null); // general error state

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<IFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    clearErrors();
    setServerError(null); // clear before submit

    try {
      const response = await api.post("/users/login", data);
      if (!response.data.status) {
        setServerError(response.data.message || "Login failed"); // show general error on top
      } else {
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        onLoginSuccess(accessToken, refreshToken);
      }
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Unable to reach server."
      );
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" mb={2} fontWeight={600} align="center">
        Sign In
      </Typography>

      {/* Show general error alert at top */}
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              autoFocus
              required
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Login"
          )}
        </Button>
      </Box>

      <Typography mt={2} align="center" variant="body2">
        Don't have an account?{" "}
        <Link component="button" type="button" onClick={onSwitchToRegister}>
          Register
        </Link>
      </Typography>
    </Paper>
  );
};

export default Login;
