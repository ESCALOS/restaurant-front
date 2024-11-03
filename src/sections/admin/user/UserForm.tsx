import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { z } from "zod";
import { User } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser, updateUser } from "../../../services/UserService";

type Props = {
  user?: User;
  closeModal: () => void;
};

// Esquema de validación con Zod
const UserSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),

  document_type: z.enum(["DNI", "CE", "PP"], {
    required_error: "El tipo de documento es requerido",
  }),

  document_number: z
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

const UserForm: React.FC<Props> = ({ user, closeModal }) => {
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>({
    defaultValues: {
      username: user?.username || "",
      document_number: user?.document_number || "",
      document_type: user?.document_type || "DNI",
      name: user?.name || "",
      phone: user?.phone || "",
      role: user?.role || "WAITER",
    },
    resolver: zodResolver(UserSchema),
  });

  const { mutate: mutateUser } = useMutation({
    mutationFn: user ? updateUser : createUser,
    onMutate: () => {
      // Mostrar toast de carga y guardar su ID para después actualizarlo
      const toastId = toast("Procesando...", {
        duration: Infinity,
      });
      setToastId(toastId);
      closeModal();
    },
    onSuccess: async (data) => {
      // Invalida la caché para obtener los datos actualizados
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      if (data.error) {
        toast.error(data.message || "Ocurrió un error al crear la mesa.");
        return;
      }

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `El usuario ${data.data?.name} ha sido ${
        user ? "actualizado" : "creado"
      } correctamente`;
      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message || "Ocurrió un error al cambiar el estado del usuario."
      );
    },
    onSettled: (data) => {
      console.log(data);
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    mutateUser({
      id: user?.id,
      ...data,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        itemsAlign: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5">Registro de Usuario</Typography>

      <TextField
        label="Nombre de Usuario"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        variant="filled"
      />

      <TextField
        label="Tipo de Documento"
        select
        {...register("document_type")}
        error={!!errors.document_type}
        helperText={errors.document_type?.message}
        variant="filled"
        defaultValue={user?.document_type || "DNI"}
      >
        <MenuItem value="DNI">DNI</MenuItem>
        <MenuItem value="CE">CE</MenuItem>
        <MenuItem value="PP">PP</MenuItem>
      </TextField>

      <TextField
        label="Número de Documento"
        {...register("document_number")}
        error={!!errors.document_number}
        helperText={errors.document_number?.message}
        variant="filled"
      />

      <TextField
        label="Nombre Completo"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="filled"
      />

      <TextField
        label="Teléfono"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        variant="filled"
      />

      <TextField
        label="Rol"
        select
        {...register("role")}
        error={!!errors.role}
        helperText={errors.role?.message}
        variant="filled"
        defaultValue={user?.role || "WAITER"}
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
