// components/ConfirmModal.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  Box,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className="confirm-dialog"
    >
      <Box className="flex items-center m-0 w-[500px]">
        <DialogTitle className="confirm-dialog-title w-full text-white bg-[#1a6f8b]">
          {title}
        </DialogTitle>
      </Box>

      <DialogContent className="dialog-text">
        <DialogContentText
          id="confirm-dialog-description"
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} className="cancel-btn rounded-[10px]"
          sx={{
            color: "#555", 
            borderColor: "#bbb", 
            "&:hover": {
              borderColor: "#888",
              backgroundColor: "#f5f5f5",
            },
          }}
         variant="outlined"
        >
          Cancel
        </Button>
        <Button onClick={onConfirm} className="confirm-btn rounded-[10px]"
          sx={{
            backgroundColor: "#258cafff", 
            "&:hover": {
              backgroundColor: "#1a6f8b", 
            },
          }}
         variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
