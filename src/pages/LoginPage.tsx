// Login.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, TextField, Button } from "@mui/material";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

// Esquema de validación
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const onSubmit = async (data: LoginFormInputs) => {
    const response = await login(data);
    if (response.error) {
      toast.error(response.message || "Error de autenticación");
      return;
    }
    const token = response.data.token;
    setToken(token);
    const { role } = useAuthStore.getState().user || {};

    if (role === "ROLE_ADMIN") {
      navigate("/table");
    } else if (role === "ROLE_WAITER") {
      navigate("/");
    } else {
      navigate("/default-dashboard");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="background.default"
    >
      {/* Logo */}
      <img
        src="/logo.webp"
        alt="Logo"
        width="100"
        height="100"
        style={{ marginBottom: "1rem" }}
      />

      {/* Nombre del local */}
      <Typography variant="h4" color="text.secondary" gutterBottom>
        El Chaufero
      </Typography>

      {/* Caja del formulario */}
      <Box
        bgcolor="#322E2B"
        borderRadius={2}
        p={4}
        width="100%"
        maxWidth="400px"
        textAlign="center"
      >
        <Typography variant="h5" color="text.primary" gutterBottom>
          Ingresar al Sistema
        </Typography>
        <Typography color="text.primary" variant="body2" gutterBottom>
          Ingrese sus credenciales para continuar
        </Typography>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nombre de usuario"
            variant="filled"
            fullWidth
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="username"
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: "primary.main", px: 3 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
