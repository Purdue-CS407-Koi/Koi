import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

export const NotificationsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Notifications</DialogTitle>
    </Dialog>
  );
}