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
import { useUserFilter } from "../../hooks/useUserFilter";
import UserCard from "../../sections/admin/user/UserCard";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/Modal";
import UserForm from "../../sections/admin/user/UserForm";

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

  const { open, children: childrenModal, openModal, closeModal } = useModal();

  const handleOpenModalCreateUser = () => {
    openModal(<UserForm closeModal={closeModal} />);
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
            <UserCard
              key={user.id}
              user={user}
              openModal={openModal}
              closeModal={closeModal}
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
      <Modal open={open} handleClose={closeModal}>
        {childrenModal}
      </Modal>
    </Box>
  );
}

export default UserPage;
