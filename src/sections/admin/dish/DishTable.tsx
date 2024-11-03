import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dish } from "../../../types";
import DishForm from "./DishForm";
import { deleteDish } from "../../../services/DishService";
import useFilteredDishes from "../../../hooks/useFilteredDishes";

type Props = {
  dishes: Dish[];
  openModal: (children: React.ReactNode) => void;
  closeModal: () => void;
  onRequestDelete: (
    action: () => Promise<void> | void,
    description: string
  ) => void;
};

function DishTable({ dishes, openModal, closeModal, onRequestDelete }: Props) {
  const { searchQuery, setSearchQuery, filteredDishes } =
    useFilteredDishes(dishes);
  const queryClient = useQueryClient();

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: deleteDish,
    onMutate: () => {
      const toastId = toast("Procesando...", { duration: Infinity });
      return toastId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
      toast.success(`El plato ha sido eliminado correctamente`);
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error al eliminar el plato.");
    },
  });

  const handleDelete = async (dish: Dish) => {
    if (isLoadingDelete) return;

    mutateDelete(dish);
  };

  const requestDelete = (dish: Dish) => {
    const description = `Se eliminará el plato ${dish.name}`;
    onRequestDelete(() => handleDelete(dish), description);
  };

  const handleEdit = (dish: Dish) => {
    openModal(<DishForm dish={dish} closeModal={closeModal} />);
  };

  return (
    <Box>
      <TextField
        label="Buscar platos"
        variant="filled"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDishes.map((dish) => (
              <TableRow key={dish.id}>
                <TableCell>{dish.name}</TableCell>
                <TableCell>{dish.description}</TableCell>
                <TableCell>{dish.price}</TableCell>
                <TableCell>{dish.category.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(dish)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => requestDelete(dish)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DishTable;
