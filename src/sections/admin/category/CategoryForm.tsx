type Props = {
  category?: Category;
  closeModal: () => void;
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Category } from "../../../types";
import { useState } from "react";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
} from "../../../services/CategoryService";
import { Box, Button, TextField, Typography } from "@mui/material";

const CategorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre de la categoría debe tener al menos 3 caracteres")
    .max(15, "El nombre de la categoría no debe exceder los 15 caracteres"),
});

type CategoryFormInputs = z.infer<typeof CategorySchema>;

function CategoryForm({ category, closeModal }: Props) {
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    defaultValues: {
      name: category?.name || "",
    },
    resolver: zodResolver(CategorySchema),
  });

  const { mutate: mutateCategory } = useMutation({
    mutationFn: category ? updateCategory : createCategory,
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
        queryKey: ["categories"],
      });

      if (data.error) {
        toast.error(data.message || "Ocurrió un error al crear la categoría.");
        return;
      }

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `La categoría ${data.data?.name} ha sido ${
        category ? "actualizada" : "creada"
      } correctamente`;

      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message ||
          "Ocurrió un error al cambiar el estado de la categoría."
      );
    },
    onSettled: () => {
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });

  const onSubmit = (data: CategoryFormInputs) => {
    mutateCategory({
      id: category?.id,
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
      <Typography variant="h5">Registro de Categoría</Typography>

      <TextField
        label="Nombre de Categoría"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="filled"
      />

      <Button type="submit" variant="contained" color="primary">
        Registrar
      </Button>
    </Box>
  );
}

export default CategoryForm;
