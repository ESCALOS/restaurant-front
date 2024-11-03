import { Dialog, DialogContent, IconButton } from "@mui/material";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
};

function Modal({ open, handleClose, children }: Props) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 3 }}>{children}</DialogContent>
    </Dialog>
  );
}

export default Modal;
