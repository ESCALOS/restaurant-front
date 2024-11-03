import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import { Table } from "../../../types";
import { ReactNode, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import TableForm from "./TableForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTable } from "../../../services/TableService";

type Props = {
  table: Table;
  openModal: (children: ReactNode) => void;
  closeModal: () => void;
  onRequestDelete: (
    action: () => Promise<void> | void,
    description: string
  ) => void;
};

function TableCard({ table, openModal, onRequestDelete, closeModal }: Props) {
  const queryClient = useQueryClient();

  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: deleteTable,
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
        queryKey: ["tables"],
      });

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `La mesa ${table.number} ha sido eliminada correctamente`;
      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message || "Ocurrió un error al cambiar el estado de la mesa."
      );
    },
    onSettled: () => {
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });

  const handleDeleteEnable = async () => {
    if (isLoadingDelete) return;

    mutateDelete(table);
  };

  const handleEdit = () => {
    openModal(<TableForm table={table} closeModal={closeModal} />);
  };

  const requestDelete = () => {
    const description = `Se eliminará la mesa ${table.number}`;
    onRequestDelete(handleDeleteEnable, description);
  };

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={table.id}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Mesa #{table.number}</Typography>
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

export default TableCard;
