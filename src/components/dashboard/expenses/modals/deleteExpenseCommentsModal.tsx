import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { type MouseEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteExpenseCommentModalProps {
  handleDelete: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteExpenseCommentModal = ({
  handleDelete,
  open,
  setOpen,
}: DeleteExpenseCommentModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    handleDelete();
    handleClose();
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle className="!text-center !pb-0">
          Delete this comment?
        </DialogTitle>
        <DialogActions className="!p-6 !pt-0 !justify-center">
          <Button
            onClick={handleClose}
            variant="contained"
            className="!bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleSubmit(e)}
            variant="contained"
            startIcon={<DeleteIcon />}
            className="!bg-[var(--color-error)]"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
