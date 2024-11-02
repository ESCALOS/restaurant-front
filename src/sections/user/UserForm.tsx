import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
};

function UserForm({ open, handleClose, title, children, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserForm;
