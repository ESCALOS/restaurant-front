import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dish } from "../../../types";
import { useState } from "react";
import { toast } from "sonner";
import { createDish, updateDish } from "../../../services/DishService";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { getCategories } from "../../../services/CategoryService";

type Props = {
  dish?: Dish;
  closeModal: () => void;
};

const DishSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre del plato debe tener al menos 3 caracteres"),

  description: z
    .string()
    .min(3, "La descripción del plato debe tener al menos 3 caracteres"),

  price: z.coerce.number().positive("El precio del plato debe ser mayor a 0"),

  category_id: z.coerce.number().min(1, "La categoría es requerida"),
});

type DishFormInputs = z.infer<typeof DishSchema>;

function DishForm({ dish, closeModal }: Props) {
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DishFormInputs>({
    defaultValues: {
      name: dish?.name || "",
      description: dish?.description || "",
      price: dish?.price || 0,
      category_id: dish?.category.id || 0,
    },
    resolver: zodResolver(DishSchema),
  });

  const { mutate: mutateDish } = useMutation({
    mutationFn: dish ? updateDish : createDish,
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
        queryKey: ["dishes"],
      });

      if (data.error) {
        toast.error(data.message || "Ocurrió un error al crear el plato.");
        return;
      }

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `El plato ${data.data?.name} ha sido ${
        dish ? "actualizado" : "creado"
      } correctamente`;

      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message || "Ocurrió un error al cambiar el estado del plato."
      );
    },
    onSettled: () => {
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });
  const onSubmit = (data: DishFormInputs) => {
    mutateDish({
      id: dish?.id,
      ...data,
    });
  };
  const categoriesOptions = categories?.data?.map((category) => (
    <MenuItem key={category.id} value={category.id}>
      {category.name}
    </MenuItem>
  ));
  const categoriesDefaultValue = dish?.category.id ? dish.category.id : 0; // Obtener el ID del primer elemento de la lista de categorías

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
      <Typography variant="h5">Registro de Dish</Typography>
      <TextField
        label="Nombre del Dish"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="filled"
      />
      <TextField
        label="Descripción"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        variant="filled"
      />
      <TextField
        label="Precio"
        {...register("price")}
        error={!!errors.price}
        helperText={errors.price?.message}
        variant="filled"
      />
      <TextField
        label="Categoría"
        select
        {...register("category_id")}
        error={!!errors.category_id}
        helperText={errors.category_id?.message}
        variant="filled"
        defaultValue={categoriesDefaultValue}
      >
        <MenuItem value={0}>Seleccionar categoría</MenuItem>
        {categoriesOptions}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Registrar
      </Button>
    </Box>
  );
}

export default DishForm;
