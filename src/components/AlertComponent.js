// AlertComponent.js
import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// This will be assigned later
let externalShowAlert;

const AlertComponent = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Something went wrong");
  const [severity, setSeverity] = useState("error");

  const showAlert = (msg, severityType = "error") => {
    setMessage(msg || "Something went wrong");
    setSeverity(severityType);
    setOpen(true);
  };

  // Assign internal function to external variable
  externalShowAlert = showAlert;

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={5000}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          backgroundColor:
            severity === "success"
              ? "#d4edda" 
              : severity === "error"
              ? "#f8d7da" 
              : severity === "warning"
              ? "#fff3cd" 
              : "#d1ecf1", 
          color: 
            severity === "success"
              ? "#155724" 
              : severity === "error"
              ? "#721c24" 
              : severity === "warning"
              ? "#856404"
              : "#0c5460",  
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Export both component and global function
export { AlertComponent };
export const showAlert = (...args) => externalShowAlert?.(...args);
