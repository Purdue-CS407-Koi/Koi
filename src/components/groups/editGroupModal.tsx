import { useState, type FormEvent, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material";
import useGroups from "@/hooks/useGroups";

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string | null;
  groupName: string;
}

export function EditGroupModal({
  open,
  onClose,
  groupId,
  groupName,
}: EditGroupModalProps) {
  const [name, setName] = useState(groupName);
  const [error, setError] = useState("");
  const { editGroup } = useGroups();

  useEffect(() => {
    setName(groupName);
  }, [groupName, open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    if (!groupId) return;
    editGroup(groupId, name.trim());
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Group Name</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="edit-group-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="groupName"
            name="groupName"
            label="Group Name"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            error={!!error}
            helperText={error}
          />
        </form>
      </DialogContent>
      <DialogActions className="!p-6 !pt-0">
        <Button onClick={onClose} variant="contained" className="!bg-gray-400">
          Cancel
        </Button>
        <Button type="submit" form="edit-group-form" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
