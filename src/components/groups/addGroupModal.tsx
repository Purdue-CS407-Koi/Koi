import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@mui/material";
import useGroups from "@/hooks/useGroups";

export function AddGroupModal() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const { insertNewGroup } = useGroups();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setGroupName("");
    setError("");
    setOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    insertNewGroup(groupName.trim());
    handleClose();
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClickOpen}
        className={`flex items-center gap-2
              p-2 mt-2 rounded-md
              cursor-pointer text-sm
              border border-sidebar-button-border
              bg-transparent
              transition-all duration-200"
            `}
      >
        <span className="text-lg">+</span>
        Add New
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="group-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="groupName"
              name="groupName"
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                if (error) setError("");
              }}
              error={!!error}
              helperText={error}
            />
          </form>
        </DialogContent>
        <DialogActions className="!p-6 !pt-0">
          <Button
            onClick={handleClose}
            variant="contained"
            className="!bg-gray-400"
          >
            Cancel
          </Button>
          <Button type="submit" form="group-form" variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
