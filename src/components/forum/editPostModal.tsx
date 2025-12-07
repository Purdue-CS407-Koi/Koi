import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
} from "@mui/material";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  currentDesc: string;
  currentPrivacy: number;
  onEdit: (postId: string, desc: string, privacy: number) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  open,
  onClose,
  postId,
  currentDesc,
  currentPrivacy,
  onEdit,
}) => {
  const [desc, setDesc] = useState(currentDesc);

  useEffect(() => {
    setDesc(currentDesc);
  }, [currentDesc, open]);

  const handleSave = () => {
    if (desc.trim()) {
      onEdit(postId, desc, currentPrivacy);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            autoFocus
            multiline
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What's on your mind?"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!desc.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};