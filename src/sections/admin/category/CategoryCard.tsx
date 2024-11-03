import { Edit, Delete } from "@mui/icons-material";
import { ReactNode, useState } from "react";
import { Category } from "../../../types";
import { deleteCategory } from "../../../services/CategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CategoryForm from "./CategoryForm";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";

type Props = {
  category: Category;
  openModal: (children: ReactNode) => void;
  closeModal: () => void;
  onRequestDelete: (
    action: () => Promise<void> | void,
    description: string
  ) => void;
};

function CategoryCard({
  category,
  openModal,
  onRequestDelete,
  closeModal,
}: Props) {
  const queryClient = useQueryClient();

  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: deleteCategory,
    onMutate: () => {
      // Mostrar toast de carga y guardar su ID para después actualizarlo
      const toastId = toast("Procesando...", {
        duration: Infinity,
      });
      setToastId(toastId);
    },
    onSuccess: async () => {
      // Invalida la caché para obtener los datos actualizados
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `La categoría ${category.name} ha sido eliminada correctamente`;
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

  const handleDeleteEnable = async () => {
    if (isLoadingDelete) return;

    mutateDelete(category);
  };

  const handleEdit = () => {
    openModal(<CategoryForm category={category} closeModal={closeModal} />);
  };

  const requestDelete = () => {
    const description = `Se eliminará la categoría ${category.name}`;
    onRequestDelete(handleDeleteEnable, description);
  };

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">{category.name}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ color: "white" }}
            startIcon={<Delete />}
            onClick={requestDelete}
            disabled={isLoadingDelete}
          >
            Eliminar
          </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
}

export default CategoryCard;
