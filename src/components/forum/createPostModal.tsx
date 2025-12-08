import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState } from "react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { desc: string; privacy: number }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [desc, setDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = () => {
    if (!desc.trim()) return;
    onCreate({ desc: desc.trim(), privacy: isPrivate ? 1 : 0 });
    setDesc("");
    setIsPrivate(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent className="flex flex-col gap-3 mt-2">
        <TextField
          label="Post Description"
          fullWidth
          autoFocus
          required
          margin="dense"
          multiline
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          }
          label="Private Post"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
