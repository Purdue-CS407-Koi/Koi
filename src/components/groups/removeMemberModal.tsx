import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";

interface RemoveMemberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

export default function RemoveMemberModal({
  open,
  onClose,
  onConfirm,
  memberName,
}: RemoveMemberModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Remove Member</DialogTitle>
        <p className="text-sm text-gray-600">
          Are you sure you want to remove <strong>{memberName}</strong> from
          this group?
        </p>
      </DialogContent>
      <DialogActions className="!p-6 !pt-0">
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
