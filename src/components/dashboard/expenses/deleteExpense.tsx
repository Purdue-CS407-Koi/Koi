import useExpenses from "@/hooks/useExpenses";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useState, type MouseEvent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteExpenseCellRenderer = (props: CustomCellRendererProps) => {
  const [open, setOpen] = useState(false);
  const { deleteExpense } = useExpenses();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    deleteExpense(props.data.id);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained">
        <DeleteIcon />
      </Button>
      <Dialog open={open}>
        <DialogTitle>Confirm deleting this expense?</DialogTitle>
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
            form="update-expense-form"
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
