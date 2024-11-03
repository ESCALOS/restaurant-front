import { z } from "zod";
import { Table } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createTable, updateTable } from "../../../services/TableService";

type Props = {
  table?: Table;
  closeModal: () => void;
};

const TableSchema = z.object({
  number: z
    .string()
    .min(1, "El número de mesa debe tener al menos 1 caracter")
    .max(15, "El número de mesa no debe exceder los 15 caracteres"),
});

type TableFormInputs = z.infer<typeof TableSchema>;

function TableForm({ table, closeModal }: Props) {
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TableFormInputs>({
    defaultValues: {
      number: table?.number || "",
    },
    resolver: zodResolver(TableSchema),
  });

  const { mutate: mutateTable } = useMutation({
    mutationFn: table ? updateTable : createTable,
    onMutate: () => {
      // Mostrar toast de carga y guardar su ID para después actualizarlo
      const toastId = toast("Procesando...", {
        duration: Infinity,
      });
      setToastId(toastId);
      closeModal();
    },
    onSuccess: async (data) => {
      // Invalida la caché para obtener los datos actualizados
      await queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      if (data.error) {
        toast.error(data.message || "Ocurrió un error al crear la mesa.");
        return;
      }

      // Reemplazar el mensaje de carga por uno de éxito
      const message = `La mesa ${data.data?.number} ha sido ${
        table ? "actualizada" : "creada"
      } correctamente`;

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

  const onSubmit = (data: TableFormInputs) => {
    mutateTable({
      id: table?.id,
      ...data,
    });
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        itemsAlign: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5">Registro de Mesa</Typography>

      <TextField
        label="Número de Mesa"
        {...register("number")}
        error={!!errors.number}
        helperText={errors.number?.message}
        variant="filled"
      />

      <Button type="submit" variant="contained" color="primary">
        Registrar
      </Button>
    </Box>
  );
}

export default TableForm;
