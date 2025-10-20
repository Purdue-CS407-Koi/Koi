import React from "react";
import {
  Dialog,
  DialogActions,
  FormControl,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import useGroups from "@/hooks/useGroups";

interface LeaveGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}

export const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({
  open,
  onClose,
  groupId,
  groupName,
}) => {
  const { leaveGroup } = useGroups();

  const handleConfirm = async () => {
    await leaveGroup(groupId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave Group</DialogTitle>
      <FormControl fullWidth>
        <DialogContent>
          Are you sure you want to leave <b>{groupName}</b>?
        </DialogContent>
      </FormControl>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};
