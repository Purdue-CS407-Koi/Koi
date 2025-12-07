import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
} from "@mui/material";

interface DeletePostModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  onDelete: (postId: string) => void;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  open,
  onClose,
  postId,
  onDelete,
}) => {
  const handleConfirm = () => {
    onDelete(postId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Post</DialogTitle>
      <FormControl fullWidth>
        <DialogContent>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogContent>
      </FormControl>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};