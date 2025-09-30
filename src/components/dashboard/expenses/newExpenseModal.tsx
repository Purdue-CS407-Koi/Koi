import useExpenses from "@/hooks/useExpenses";
import type { NewExpense } from "@/interfaces/Expense";
import { useBucketsStore } from "@/stores/useBucketsStore";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from "@mui/material";
import { useState, type FormEvent } from "react";

export const NewExpenseModal = () => {
  const [open, setOpen] = useState(false);
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );
  const { insertNewExpense } = useExpenses();

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
    const newExpense: NewExpense = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      bucket_instance_id: currentBucketInstanceId,
    };
    insertNewExpense(newExpense);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained">
        New Expense
      </Button>
      <Dialog open={open}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Expense Name"
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
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
          <Button type="submit" form="subscription-form" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
