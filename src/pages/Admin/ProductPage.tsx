import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/ProductService";
import { Box, Button, Typography } from "@mui/material";
import { useConfirmModal } from "../../hooks/useConfirmModal";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import ProductForm from "../../sections/admin/product/ProductForm";
import ConfirmModal from "../../components/ConfirmModal";
import { Add } from "@mui/icons-material";
import Modal from "../../components/Modal";
import ProductTable from "../../sections/admin/product/ProductTable";

function ProductPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const {
    open: isOpenConfirm,
    description: descriptionConfirm,
    openConfirmModal,
    closeConfirmModal,
  } = useConfirmModal();

  const products = data?.data ?? [];

  const [onSave, setonSave] = useState<() => void>(() => {});

  const { open, children: childrenModal, openModal, closeModal } = useModal();

  const handleOpenModalCreateProduct = () => {
    openModal(<ProductForm closeModal={closeModal} />);
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
        <Typography variant="h4">Lista de productos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModalCreateProduct}
        >
          Crear Producto
        </Button>
      </Box>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <ProductTable
          products={products}
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

export default ProductPage;
