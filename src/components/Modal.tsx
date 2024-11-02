import { Dialog } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
};

function Modal({ open, handleClose, children }: Props) {
  return (
    <Dialog open={open} onClose={handleClose}>
      {children}
    </Dialog>
  );
}

export default Modal;
