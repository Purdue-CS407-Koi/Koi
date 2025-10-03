import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  getRecurrencePeriodDisplayName,
  RecurrencePeriodType,
  type NewBucketMetadata,
} from "@/interfaces/Bucket";
import { capitalizeFirstLetter } from "@/helpers/utilities";
import { useBuckets } from "@/hooks/useBuckets";

const NewBucketModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { createBucketMetadata } = useBuckets();

  const [bucketName, setBucketName] = useState<string>("");
  const [recurrencePeriod, setRecurrencePeriod] = useState<number>(0);
  const [rawSpendingLimit, setRawSpendingLimit] = useState<string>("");

  const spendingLimit = (() => {
    const parsed = parseFloat(rawSpendingLimit);
    return isNaN(parsed) ? null : parsed;
  })();

  const spendingLimitErrorText: string | null = (() => {
    if (rawSpendingLimit.length > 0 && !/^[0-9.]*$/.test(rawSpendingLimit)) {
      return "Non-numeric character not allowed";
    }

    const decimalIndex = rawSpendingLimit.indexOf(".");
    if (decimalIndex !== -1 && rawSpendingLimit.length - decimalIndex - 1 > 2) {
      return "Too many decimal places";
    }

    return null;
  })();

  const spendingLimitError = spendingLimitErrorText !== null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (spendingLimitError) return;

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    const newBucket: NewBucketMetadata = {
      name: bucketName,
      recurrence_period_type: recurrencePeriod as RecurrencePeriodType,
      // Spending limit gets stored as int in DB
      spending_limit: spendingLimit! * 100,
    };

    try {
      createBucketMetadata(newBucket);
      setOpen(false);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Add New Bucket</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="new-bucket-form">
          <FormControl fullWidth>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Bucket Name"
              value={bucketName}
              onChange={(e) => {
                setBucketName(e.target.value);
              }}
              fullWidth
            />

            <InputLabel id="recurrence-period-label">
              Recurrence Period
            </InputLabel>
            <Select
              margin="dense"
              labelId="recurrence-period-label"
              id="recurrence-period"
              name="recurrence-period"
              label="Recurrence Period"
              value={recurrencePeriod}
              onChange={(e) => {
                setRecurrencePeriod(e.target.value);
              }}
              fullWidth
            >
              {Object.keys(RecurrencePeriodType).map((key) => {
                const typedKey = key as keyof typeof RecurrencePeriodType;
                return (
                  <MenuItem value={RecurrencePeriodType[typedKey]}>
                    {capitalizeFirstLetter(
                      getRecurrencePeriodDisplayName(
                        RecurrencePeriodType[typedKey]
                      )
                    )}
                  </MenuItem>
                );
              })}
            </Select>

            <TextField
              error={spendingLimitError}
              margin="dense"
              id="spending-limit"
              name="spending-limit"
              label="Spending Limit"
              value={rawSpendingLimit}
              helperText={spendingLimitErrorText}
              onChange={(e) => {
                setRawSpendingLimit(e.target.value);
              }}
              fullWidth
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions className="!p-6 !pt-0">
        <Button
          onClick={() => {
            setOpen(false);
          }}
          variant="contained"
          className="!bg-gray-400"
        >
          Cancel
        </Button>
        <Button type="submit" form="new-bucket-form" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewBucketModal;
