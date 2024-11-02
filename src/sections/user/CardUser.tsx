import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import { Edit, ToggleOn, ToggleOff } from "@mui/icons-material";
import { User } from "../../types";
import { toggleUser } from "../../services/UserService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  user: User;
  onEdit: (user: User) => void;
  onRequestToggle: (
    action: () => Promise<void> | void,
    description: string
  ) => void;
};

function CardUser({ user, onEdit, onRequestToggle }: Props) {
  const queryClient = useQueryClient();
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const { mutate: mutateToggle, isPending: isLoadingToggle } = useMutation({
    mutationFn: toggleUser,
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
        queryKey: ["users"],
      });

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `El usuario ${user.name} ha sido ${user.is_enabled ? "deshabilitado" : "habilitado"} correctamente`;
      toast.success(message);
    },
    onError: (error) => {
      // Reemplazar el mensaje de carga por uno de error
      toast.error(
        error.message || "Ocurrió un error al cambiar el estado del usuario."
      );
    },
    onSettled: () => {
      // Invalidar la caché de todas formas para tener datos frescos
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      // Opcionalmente, remover el toast si quedó abierto
      if (toastId) toast.dismiss(toastId);
    },
  });

  // Función para habilitar/deshabilitar el usuario
  const handleToggleEnable = async () => {
    if (isLoadingToggle) return;

    mutateToggle(user);
  };

  const requestToggle = () => {
    const description = `Se ${user.is_enabled ? "des" : ""}habilitará el usuario ${user.name}`;
    onRequestToggle(handleToggleEnable, description);
  };

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">{user.name}</Typography>
          <Typography color="text.primary">@{user.username}</Typography>
          <Typography variant="body2">
            Documento: {user.document_type} - {user.document_number}
          </Typography>
          <Typography variant="body2">Celular: {user.phone}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => onEdit(user)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color={user.is_enabled ? "warning" : "success"}
            startIcon={user.is_enabled ? <ToggleOff /> : <ToggleOn />}
            onClick={requestToggle}
            disabled={isLoadingToggle}
          >
            {user.is_enabled ? "Deshabilitar" : "Habilitar"}
          </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
}

export default CardUser;
