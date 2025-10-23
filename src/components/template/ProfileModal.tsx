import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    email: string | null;
  } | null;
  onSave: (updatedEmail: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSave = () => {
    onSave(email.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold text-gray-800">
        Profile Details
      </DialogTitle>

      <DialogContent className="flex flex-col gap-4 mt-2">
        <div>
          <p className="text-sm text-gray-500 mb-1">Name</p>
          <p className="text-base font-medium">
            {user?.name || "Unnamed User"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <TextField
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions className="px-6 pb-3">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
