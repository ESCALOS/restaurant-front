import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Product } from "../../../types";
import { useState } from "react";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../../../services/ProductService";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { getCategories } from "../../../services/CategoryService";

type Props = {
  product?: Product;
  closeModal: () => void;
};

const ProductSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre del producto debe tener al menos 3 caracteres"),

  description: z
    .string()
    .min(3, "La descripción del producto debe tener al menos 3 caracteres"),

  price: z.coerce
    .number()
    .positive("El precio del producto debe ser mayor a 0"),

  min_stock: z.coerce
    .number()
    .nonnegative("El stock debe ser mayor o igual a 0"),
  stock: z.coerce.number().nonnegative("El stock debe ser mayor o igual a 0"),
  category_id: z.coerce.number().min(1, "La categoría es requerida"),
});

type ProductFormInputs = z.infer<typeof ProductSchema>;

function ProductForm({ product, closeModal }: Props) {
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
  } = useForm<ProductFormInputs>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      min_stock: product?.min_stock || 0,
      stock: product?.stock || 0,
    },
    resolver: zodResolver(ProductSchema),
  });

  const { mutate: mutateProduct } = useMutation({
    mutationFn: product ? updateProduct : createProduct,
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
        queryKey: ["products"],
      });

      if (data.error) {
        toast.error(data.message || "Ocurrió un error al crear el producto.");
        return;
      }

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `El producto ${data.data?.name} ha sido ${
        product ? "actualizado" : "creado"
      } correctamente`;

      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message || "Ocurrió un error al cambiar el estado del producto."
      );
    },
    onSettled: () => {
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });
  const onSubmit = (data: ProductFormInputs) => {
    mutateProduct({
      id: product?.id,
      ...data,
    });
  };
  const categoriesOptions = categories?.data?.map((category) => (
    <MenuItem key={category.id} value={category.id}>
      {category.name}
    </MenuItem>
  ));
  const categoriesDefaultValue = product?.category.id ? product.category.id : 0; // Obtener el ID del primer elemento de la lista de categorías

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
      <Typography variant="h5">Registro de Producto</Typography>
      <TextField
        label="Nombre del Producto"
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
      <TextField
        label="Stock mínimo"
        {...register("min_stock")}
        error={!!errors.min_stock}
        helperText={errors.min_stock?.message}
        variant="filled"
      />
      <TextField
        label="Stock actual"
        {...register("stock")}
        error={!!errors.stock}
        helperText={errors.stock?.message}
        variant="filled"
      />
      <Button type="submit" variant="contained" color="primary">
        Registrar
      </Button>
    </Box>
  );
}

export default ProductForm;
