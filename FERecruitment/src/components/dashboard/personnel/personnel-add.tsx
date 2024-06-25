
import React, {  useEffect,useRef } from "react";
import { Dialog, IconButton, DialogTitle, DialogContent, Grid, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, DialogActions, TextField } from "@mui/material";

const status = [{ label: "Duyệt" }, { label: "Chờ duyệt" }, { label: "Không duyệt" }];

interface PersonnelAddProps {
  open: boolean;
  onClose: () => void;
}

export default function PersonnelAdd({ open, onClose }: PersonnelAddProps): React.JSX.Element {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open && cancelButtonRef.current !== null) {
      cancelButtonRef.current.focus();
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll={"body"}>
      <DialogTitle sx={{ p: 3 }}>Thêm nhân viên</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Trừ tạm ứng"
              variant="outlined"
              name="advanceDeduction"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Thưởng"
              variant="outlined"
              name="bonus"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
          </Grid>
        </Grid>
        <Autocomplete
          size="small"
          disablePortal
          id="combo-box-demo"
          options={status}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Trạng thái *" />
          )}
          sx={{ marginBottom: 2, marginTop: 1 }}
        />
        <TextField
          multiline
          rows={2}
          label="Ghi chú *"
          variant="outlined"
          fullWidth
          id="notes"
          sx={{ marginBottom: 2, marginTop: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClose}  ref={cancelButtonRef}>
          Hủy
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
