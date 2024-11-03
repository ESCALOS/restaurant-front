import { Box, Button, Grid2, Typography } from "@mui/material";
import { getTables } from "../../services/TableService";
import { useQuery } from "@tanstack/react-query";
import TableCard from "../../sections/admin/table/TableCard";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import TableForm from "../../sections/admin/table/TableForm";
import ConfirmModal from "../../components/ConfirmModal";
import { Add } from "@mui/icons-material";
import Modal from "../../components/Modal";

function TablePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const {
    open: isOpenConfirm,
    description: descriptionConfirm,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const tables = data?.data ?? [];

  const [onSave, setonSave] = useState<() => void>(() => {});

  const { open, children: childrenModal, openModal, closeModal } = useModal();

  const handleOpenModalCreateTable = () => {
    openModal(<TableForm closeModal={closeModal} />);
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
        <Typography variant="h4">Lista de mesas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModalCreateTable}
        >
          Crear Mesa
        </Button>
      </Box>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <Grid2 container spacing={2}>
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              openModal={openModal}
              closeModal={closeModal}
              onRequestDelete={handleOpenModal}
            />
          ))}
        </Grid2>
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

export default TablePage;
