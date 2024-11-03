import { ReactNode, useState } from "react";

export const useModal = () => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState<ReactNode>(null);
  const openModal = (children: ReactNode) => {
    setChildren(children);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  return {
    open,
    children,
    openModal,
    closeModal,
  };
};
