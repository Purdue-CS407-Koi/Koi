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
import { useGroupStore } from "@/stores/useGroupStore";
import useGroups from "@/hooks/useGroups";

export const InviteFriendModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentGroupId = useGroupStore((state) => state.currentGroupId);
  const { inviteFriend } = useGroups();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      inviteFriend(currentGroupId, email.trim());

      setSuccessMsg("Invite sent successfully!");
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Failed to send invite.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccessMsg("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Invite a Friend</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="invite-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            label="Friend's Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccessMsg("");
            }}
          />
        </form>

        {error && <Alert severity="error" className="mt-2">{error}</Alert>}
        {successMsg && <Alert severity="success" className="mt-2">{successMsg}</Alert>}
      </DialogContent>

      <DialogActions className="!p-6 !pt-0">
        <Button onClick={handleClose} variant="contained" className="!bg-gray-400">
          Cancel
        </Button>
        <Button
          type="submit"
          form="invite-form"
          variant="contained"
          disabled={!!successMsg}
        >
          Send Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
};
