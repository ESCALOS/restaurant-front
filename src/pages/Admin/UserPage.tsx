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
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useConfirmModal } from "../../hooks/useConfirmModal";

function UserPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    open: isOpenConfirm,
    description: descriptionConfirm,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const [onSave, setonSave] = useState<() => void>(() => {});

  const users = data?.data ?? [];

  const {
    searchQuery,
    setSearchQuery,
    showEnabled,
    setShowEnabled,
    filteredUsers,
  } = useUserFilter(users);

  const handleOpenModalCreateUser = () => {
    console.log("Abriendo modal de creación de usuario");
  };

  // Función para manejar la edición del usuario
  const handleEdit = (user: User) => {
    // Aquí podrías abrir un modal o redirigir a una página de edición
    console.log("Editar usuario:", user);
  };

  const handleOpenModal = (
    action: () => Promise<void> | void,
    description: string
  ) => {
    setonSave(() => action);
    openConfirmModal(description);
  };

  const onToggleEnable = async () => {
    closeConfirmModal();
    if (onSave) await onSave();
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModalCreateUser}
        >
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
              onEdit={handleEdit}
              onRequestToggle={handleOpenModal}
            />
          ))}
        </Grid2>
      )}
      <ConfirmModal
        open={isOpenConfirm}
        handleClose={closeConfirmModal}
        description={descriptionConfirm}
        onConfirm={onToggleEnable}
      />
    </Box>
  );
}

export default UserPage;
