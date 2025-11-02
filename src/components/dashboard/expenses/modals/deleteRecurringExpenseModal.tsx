import useExpenses from "@/hooks/useExpenses";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  IconButton,
} from "@mui/material";
import { useState, type MouseEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import type { RecurringExpense } from "@/interfaces/Expense";

export const DeleteRecurringExpenseModal = ({
  expenseData,
}: {
  expenseData: RecurringExpense;
}) => {
  const { deleteRecurringExpense } = useExpenses();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    deleteRecurringExpense(expenseData.id);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle className="!text-center !pb-0">
          Delete this recurring expense?
        </DialogTitle>
        <DialogContentText className="!text-center !pb-3 !pt-1">
          {expenseData.name}
        </DialogContentText>
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
