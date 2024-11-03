import {
  Box,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Product } from "../../../types";
import ProductForm from "./ProductForm";
import { deleteProduct } from "../../../services/ProductService";
import useFilteredProducts from "../../../hooks/useFilteredProducts";

type Props = {
  products: Product[];
  openModal: (children: React.ReactNode) => void;
  closeModal: () => void;
  onRequestDelete: (
    action: () => Promise<void> | void,
    description: string
  ) => void;
};

function ProductTable({
  products,
  openModal,
  closeModal,
  onRequestDelete,
}: Props) {
  const {
    searchQuery,
    setSearchQuery,
    showLowStock,
    setShowLowStock,
    filteredProducts,
  } = useFilteredProducts(products);
  const queryClient = useQueryClient();

  const { mutate: mutateDelete, isPending: isLoadingDelete } = useMutation({
    mutationFn: deleteProduct,
    onMutate: () => {
      const toastId = toast("Procesando...", { duration: Infinity });
      return toastId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success(`El producto ha sido eliminado correctamente`);
    },
    onError: (error) => {
      toast.error(error.message || "Ocurrió un error al eliminar el producto.");
    },
  });

  const handleDelete = async (product: Product) => {
    if (isLoadingDelete) return;

    mutateDelete(product);
  };

  const requestDelete = (product: Product) => {
    const description = `Se eliminará el producto ${product.name}`;
    onRequestDelete(() => handleDelete(product), description);
  };

  const handleEdit = (product: Product) => {
    openModal(<ProductForm product={product} closeModal={closeModal} />);
  };

  return (
    <Box>
      <TextField
        label="Buscar productos"
        variant="filled"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box display="flex" alignItems="center" marginY={2}>
        <Switch
          checked={showLowStock}
          onChange={(e) => setShowLowStock(e.target.checked)}
        />
        <Typography>Mostrar solo productos con stock bajo</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.min_stock}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => requestDelete(product)}
                  >
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

export default ProductTable;
