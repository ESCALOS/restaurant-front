import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  handleClose: () => void;
  description: string;
  onConfirm: () => void;
};

function ConfirmModal({ open, handleClose, description, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={handleClose}>
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
      <DialogContent>
        <DialogContentText sx={{ color: "white", pr: "20px" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", display: "flex" }}>
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
