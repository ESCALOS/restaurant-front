import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/CategoryService";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useModal } from "../../hooks/useModal";
import Modal from "../../components/Modal";
import CategoryForm from "../../sections/admin/category/CategoryForm";
import CategoryCard from "../../sections/admin/category/CategoryCard";

function CategoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    open: isOpenConfirm,
    description: descriptionConfirm,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const categories = data?.data ?? [];

  const [onSave, setonSave] = useState<() => void>(() => {});

  const { open, children: childrenModal, openModal, closeModal } = useModal();

  const handleOpenModalCreateCategory = () => {
    openModal(<CategoryForm closeModal={closeModal} />);
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
        <Typography variant="h4">Lista de categorías</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModalCreateCategory}
        >
          Crear Categoría
        </Button>
      </Box>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <Grid2 container spacing={2}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
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

export default CategoryPage;
