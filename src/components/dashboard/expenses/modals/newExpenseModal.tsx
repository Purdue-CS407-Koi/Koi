import useUserChallenges from "@/hooks/useChallenges";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, type FormEvent } from "react";

export const NewExpenseModal = () => {
  const [open, setOpen] = useState(false);
  const { currentBucketInstanceId } = useBucketsStore();
  const { insertNewExpense } = useExpenses();
  const { activeChallengeData } = useUserChallenges();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentBucketInstanceId) {
      console.error("Attempted to create a new expense entry with no bucket instance ID!");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const newExpense: NewExpense = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      bucket_instance_id: currentBucketInstanceId,
      challenge_id: formJson.challenge.trim() || null,
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="challenge-label">Challenge</InputLabel>
              <Select
                labelId="challenge-label"
                id="challenge"
                name="challenge"
                label="Challenge"
                defaultValue=""
              >
                <MenuItem value="" className="text-gray-500">(No Challenge)</MenuItem>
                {activeChallengeData?.map((challenge) => (
                  <MenuItem key={challenge.id} value={challenge.id}>
                    {challenge.name}
                  </MenuItem>
                )) || <MenuItem value="">No Active Challenge</MenuItem>}
              </Select>
            </FormControl>
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
