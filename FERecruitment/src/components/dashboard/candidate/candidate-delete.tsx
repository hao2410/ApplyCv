

import React from "react";
import { Dialog,DialogTitle, DialogContent,DialogContentText } from "@mui/material";

import { Button, DialogActions} from "@mui/material";


interface DeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCandidate({ open, onClose,onConfirm }: DeleteProps): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>Xác nhận xóa</DialogTitle>
    <DialogContent>
      <DialogContentText>Bạn có chắc chắn muốn xóa mục này không?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Hủy</Button>
      <Button onClick={onConfirm} color="primary">Xóa</Button>
    </DialogActions>
  </Dialog>
  );
}
