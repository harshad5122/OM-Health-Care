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
// import { AlertTriangle } from "lucide-react"; 
import "../styles/ConfirmModal.css";

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
      <Box className="dialog-header">
        {/* <AlertTriangle className="dialog-icon" /> */}
        <DialogTitle id="confirm-dialog-title" className="dialog-title">
          {title}
        </DialogTitle>
      </Box>

      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          className="dialog-text"
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onCancel} className="cancel-btn"
        sx={{
    color: "#555", 
    borderColor: "#bbb", 
    "&:hover": {
      borderColor: "#888",
      backgroundColor: "#f5f5f5",
    },
  }}
         variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="confirm-btn"
        sx={{
    backgroundColor: "#258cafff", 
    "&:hover": {
      backgroundColor: "#1a6f8b", 
    },
  }}
         variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
