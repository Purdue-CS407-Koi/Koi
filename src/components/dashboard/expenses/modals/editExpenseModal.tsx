import useExpenses from "@/hooks/useExpenses";
import type { UpdateExpenseProps } from "@/interfaces/Expense";
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
import type { CustomCellRendererProps } from "ag-grid-react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import useUserChallenges from "@/hooks/useChallenges";
import { EditExpenseDate } from "../editExpenseDate";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { useBuckets } from "@/hooks/useBuckets";
import { RecurrencePeriodType } from "@/interfaces/Bucket";

interface EditExpenseModalProps {
  cellProps: CustomCellRendererProps;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Value = Date | null;

export const EditExpenseModal = ({
  cellProps,
  open,
  setOpen,
}: EditExpenseModalProps) => {
  const { updateExpense } = useExpenses();
  const { activeChallengeData } = useUserChallenges();
  const { bucketMetadataData } = useBuckets();
  const { currentBucketMetadataId } = useBucketsStore();

  const [value, setValue] = useState<Value>(
    new Date(`${cellProps.data.created_at}T00:00`)
  );

  const currentBucket = bucketMetadataData?.find(
    (x) => x.id === currentBucketMetadataId,
  );

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
    const updatedExpense: UpdateExpenseProps = {
      amount: formJson.amount,
      description: formJson.description,
      name: formJson.name,
      id: cellProps.data.id,
      challenge_id: formJson.challenge.trim() || null,
      created_at: value!.toISOString(),
    };
    updateExpense(updatedExpense);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClickOpen} variant="contained">
        <ModeEditIcon />
      </Button>
      <Dialog open={open}>
        <DialogTitle>Update Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="update-expense-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Expense Name"
              defaultValue={cellProps.data.name}
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              defaultValue={cellProps.data.amount}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              name="description"
              label="Description"
              defaultValue={cellProps.data.description}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="challenge-label">Challenge</InputLabel>
              <Select
                labelId="challenge-label"
                id="challenge"
                name="challenge"
                label="Challenge"
                defaultValue={cellProps.data.challenge_id || ""}
              >
                <MenuItem value="" className="text-gray-500">
                  (No Challenge)
                </MenuItem>
                {activeChallengeData?.map((challenge) => (
                  <MenuItem key={challenge.id} value={challenge.id}>
                    {challenge.name}
                  </MenuItem>
                )) || <MenuItem value="">No Active Challenge</MenuItem>}
              </Select>
            </FormControl>
            {(currentBucket?.recurrence_period_type as RecurrencePeriodType) ===
            RecurrencePeriodType.Daily ? (
              <p className="text-gray-500 mt-8 mb-4">
                Dates of expenses in daily buckets cannot be changed.
              </p>
            ) : (
              <EditExpenseDate value={value} setValue={setValue} />
            )}
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
