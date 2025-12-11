import useExpenses from "@/hooks/useExpenses";
import type {
  RecurringExpense,
  UpdateRecurringExpenseProps,
} from "@/interfaces/Expense";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import { type FormEvent } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useState } from "react";

export const EditRecurringExpenseModal = ({
  expenseData,
}: {
  expenseData: RecurringExpense;
}) => {
  const { updateRecurringExpense } = useExpenses();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const updatedExpense: UpdateRecurringExpenseProps = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      id: expenseData.id,
    };
    updateRecurringExpense(updatedExpense);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} aria-label="edit">
        <ModeEditIcon />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>Update Recurring Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="update-expense-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Expense Name"
              defaultValue={expenseData.name}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              defaultValue={expenseData.amount}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Description"
              defaultValue={expenseData.description}
              fullWidth
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
          <Button type="submit" form="update-expense-form" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
