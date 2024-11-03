import { useQuery } from "@tanstack/react-query";
import { getDishes } from "../../services/DishService";
import { Box, Button, Typography } from "@mui/material";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import DishForm from "../../sections/admin/dish/DishForm";
import ConfirmModal from "../../components/ConfirmModal";
import { Add } from "@mui/icons-material";
import Modal from "../../components/Modal";
import DishTable from "../../sections/admin/dish/DishTable";

function DishPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const {
    open: isOpenConfirm,
    description: descriptionConfirm,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const dishes = data?.data ?? [];

  const [onSave, setonSave] = useState<() => void>(() => {});

  const { open, children: childrenModal, openModal, closeModal } = useModal();

  const handleOpenModalCreateDish = () => {
    openModal(<DishForm closeModal={closeModal} />);
  };

  const handleOpenModal = (
    action: () => Promise<void> | void,
    description: string
  ) => {
    setonSave(() => action);
    openConfirmModal(description);
  };

  const onDeleteEnable = async () => {
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
        <Typography variant="h4">Lista de platos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModalCreateDish}
        >
          Crear Plato
        </Button>
      </Box>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <DishTable
          dishes={dishes}
          openModal={openModal}
          closeModal={closeModal}
          onRequestDelete={handleOpenModal}
        />
      )}
      <ConfirmModal
        open={isOpenConfirm}
        handleClose={closeConfirmModal}
        description={descriptionConfirm}
        onConfirm={onDeleteEnable}
      />
      <Modal open={open} handleClose={closeModal}>
        {childrenModal}
      </Modal>
    </Box>
  );
}

export default DishPage;
