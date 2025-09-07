import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

interface IFormInputs {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC<RegisterProps> = ({
  onSwitchToLogin,
  onRegisterSuccess,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<IFormInputs>({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    clearErrors();
    setServerError(null);

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await api.post("/users/register", {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (!response.data.status) {
        setServerError(response.data.message || "Registration failed");
      } else {
        onRegisterSuccess();
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
        Register
      </Typography>

      {/* General server error alert on top */}
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
          name="firstname"
          control={control}
          rules={{ required: "First name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              autoFocus
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
            />
          )}
        />

        <Controller
          name="lastname"
          control={control}
          rules={{ required: "Last name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              fullWidth
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

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
              fullWidth
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
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
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
            "Register"
          )}
        </Button>
      </Box>

      <Typography mt={2} align="center" variant="body2">
        Already have an account?{" "}
        <Link component="button" type="button" onClick={onSwitchToLogin}>
          Login
        </Link>
      </Typography>
    </Paper>
  );
};

export default Register;
