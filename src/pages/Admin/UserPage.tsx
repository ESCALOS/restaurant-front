import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/UserService";
import {
  Button,
  Typography,
  Grid2,
  Box,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { User } from "../../types";
import { useUserFilter } from "../../hooks/useUserFilter";
import CardUser from "../../sections/user/CardUser";
import Confirm from "../../components/ConfirmModal";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";

function UserPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    open: openModalConfirm,
    handleOpen: handleOpenConfirm,
    handleClose: handleCloseConfirm,
  } = useModal();

  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const users = data?.data ?? [];

  const {
    searchQuery,
    setSearchQuery,
    showEnabled,
    setShowEnabled,
    filteredUsers,
  } = useUserFilter(users);

  // Función para manejar la edición del usuario
  const handleEdit = (user: User) => {
    // Aquí podrías abrir un modal o redirigir a una página de edición
    console.log("Editar usuario:", user);
  };

  const handleOpenConfirmModal = (action: () => Promise<void> | void) => {
    setOnConfirm(() => action); // Guarda la función del hijo para ejecutarla al confirmar
    handleOpenConfirm();
  };

  const onToggleEnable = async () => {
    handleCloseConfirm();
    if (onConfirm) await onConfirm();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">Lista de usuarios</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          Crear Usuario
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showEnabled}
              onChange={(event) => setShowEnabled(event.target.checked)}
              color="secondary"
            />
          }
          label={showEnabled ? "Habilitados" : "Deshabilitados"}
        />
      </Box>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <Grid2 container spacing={2}>
          {filteredUsers.map((user) => (
            <CardUser
              key={user.id}
              user={user}
              onToggleEnable={handleOpenConfirm}
              onEdit={handleEdit}
              onRequestToggle={handleOpenConfirmModal}
            />
          ))}
        </Grid2>
      )}
      <Confirm
        open={openModalConfirm}
        handleClose={handleCloseConfirm}
        title="¿Estás seguro de que deseas eliminar este usuario?"
        description="Esta acción si se puede deshacer."
        onConfirm={onToggleEnable}
      />
    </Box>
  );
}

export default UserPage;
