import useExpenses from "@/hooks/useExpenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import type { TablesInsert } from "@/helpers/supabase.types";
import AddIcon from "@mui/icons-material/Add";

export const NewRecurringExpenseModal = () => {
  const [open, setOpen] = useState(false);
  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId
  );
  const { insertNewRecurringExpense } = useExpenses();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentBucketMetadataId) {
      console.error(
        "Attempted to create a new recurring expense entry with no bucket metadata ID!"
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const newExpense: TablesInsert<"RecurringExpenses"> = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      bucket_metadata_id: currentBucketMetadataId,
    };
    insertNewRecurringExpense(newExpense);
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} aria-label="add">
        <AddIcon className="text-[var(--color-primary)]" />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>Add New Recurring Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Recurring Expense Name"
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
