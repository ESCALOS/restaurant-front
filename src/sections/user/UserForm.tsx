import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { z } from "zod";

// Esquema de validación con Zod
const UserSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),

  document_number: z.enum(["DNI", "CE", "PP"], {
    required_error: "El tipo de documento es requerido",
  }),

  document_type: z
    .string()
    .min(8, "El número de documento debe tener al menos 8 caracteres")
    .max(15, "El número de documento no debe exceder los 15 caracteres"),

  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

  phone: z
    .string()
    .min(6, "El teléfono debe tener al menos 6 caracteres")
    .max(15, "El teléfono no debe exceder los 15 caracteres"),

  role: z.enum(["ADMIN", "WAITER", "STOREKEEPER"], {
    required_error: "El rol es requerido",
  }),
});

// Tipo inferido de Zod para el formulario
type UserFormInputs = z.infer<typeof UserSchema>;

const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (data: UserFormInputs) => {
    console.log("Datos del formulario:", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h5">Registro de Usuario</Typography>

      <TextField
        label="Nombre de Usuario"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        variant="outlined"
      />

      <TextField
        label="Tipo de Documento"
        select
        {...register("document_number")}
        error={!!errors.document_number}
        helperText={errors.document_number?.message}
        variant="outlined"
      >
        <MenuItem value="DNI">DNI</MenuItem>
        <MenuItem value="CE">CE</MenuItem>
        <MenuItem value="PP">PP</MenuItem>
      </TextField>

      <TextField
        label="Número de Documento"
        {...register("document_type")}
        error={!!errors.document_type}
        helperText={errors.document_type?.message}
        variant="outlined"
      />

      <TextField
        label="Nombre Completo"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
      />

      <TextField
        label="Teléfono"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        variant="outlined"
      />

      <TextField
        label="Rol"
        select
        {...register("role")}
        error={!!errors.role}
        helperText={errors.role?.message}
        variant="outlined"
      >
        <MenuItem value="ADMIN">Administrador</MenuItem>
        <MenuItem value="WAITER">Mesero</MenuItem>
        <MenuItem value="STOREKEEPER">Almacenero</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" color="primary">
        Registrar
      </Button>
    </Box>
  );
};

export default UserForm;
