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
} from "@/interfaces/Bucket";
import { capitalizeFirstLetter } from "@/helpers/utilities";
import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { getSpendingLimit, getSpendingLimitErrorText } from "./helpers";
import type { Tables, TablesInsert } from "@/helpers/supabase.types";

const NewBucketModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { createBucketMetadataAsync } = useBuckets();
  const { setCurrentBucketMetadataId } = useBucketsStore();

  const [bucketName, setBucketName] = useState<string>("");
  const [recurrencePeriod, setRecurrencePeriod] = useState<number>(0);
  const [rawSpendingLimit, setRawSpendingLimit] = useState<string>("");

  const spendingLimit = getSpendingLimit(rawSpendingLimit);
  const spendingLimitErrorText = getSpendingLimitErrorText(rawSpendingLimit);
  const spendingLimitError = spendingLimitErrorText !== null;

  const bucketNameEmpty = bucketName === "";

  const formValid = !spendingLimitError && !bucketNameEmpty;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formValid) return;

    const newBucket: TablesInsert<"BucketMetadata"> = {
      name: bucketName,
      recurrence_period_type: recurrencePeriod as RecurrencePeriodType,
      // Spending limit gets stored as int in DB
      spending_limit: spendingLimit! * 100,
    };

    try {
      const result: Tables<"BucketMetadata"> = await createBucketMetadataAsync(
        newBucket
      );

      // Reset all fields
      setBucketName("");
      setRawSpendingLimit("");

      // Set current to newly created BucketMetadata
      setCurrentBucketMetadataId(result.id);

      // Close modal
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
        <form
          onSubmit={handleSubmit}
          id="new-bucket-form"
          className="flex flex-col gap-4"
        >
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
          </FormControl>

          <FormControl fullWidth>
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
          </FormControl>

          <FormControl fullWidth>
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
        <Button type="submit" form="new-bucket-form" variant="contained" disabled={!formValid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewBucketModal;
