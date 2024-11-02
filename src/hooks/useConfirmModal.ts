import { useState } from "react";

export const useConfirmModal = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const closeConfirmModal = () => {
    setOpen(false);
  };
  const openConfirmModal = (description: string) => {
    setDescription(description);
    handleOpen();
  };
  return {
    description,
    open,
    openConfirmModal,
    closeConfirmModal,
  };
};
