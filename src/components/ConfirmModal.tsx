import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
};

function ConfirmModal({
  open,
  handleClose,
  onConfirm,
  title,
  description,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          sx={{ color: "white", backgroundColor: "red" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          sx={{ color: "background.default", backgroundColor: "primary.main" }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
