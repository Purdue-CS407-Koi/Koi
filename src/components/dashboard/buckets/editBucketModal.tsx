import { useEffect, useState, type FormEvent } from "react";
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
import { getSpendingLimit, getSpendingLimitErrorText } from "./helpers";
import { getBucketMetadata } from "@/api/buckets";
import type { TablesUpdate } from "@/helpers/supabase.types";

export const EditBucketModal = ({
  setOpen,
  bucketMetadataId,
}: {
  setOpen: (open: boolean) => void;
  bucketMetadataId: string;
}) => {
  const { editBucketMetadata } = useBuckets();

  const [bucketName, setBucketName] = useState<string | null>("");
  const [recurrencePeriod, setRecurrencePeriod] = useState<number | null>(0);
  const [rawSpendingLimit, setRawSpendingLimit] = useState<string>("");

  const spendingLimit = getSpendingLimit(rawSpendingLimit);
  const spendingLimitErrorText = getSpendingLimitErrorText(rawSpendingLimit);
  const spendingLimitError = spendingLimitErrorText !== null;

  const bucketNameEmpty = bucketName === "";

  const formValid = !spendingLimitError && !bucketNameEmpty;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValid) return;

    const editedBucketData: TablesUpdate<"BucketMetadata"> = {
      name: bucketName,
      recurrence_period_type: recurrencePeriod as RecurrencePeriodType,
      spending_limit: spendingLimit!,
    };

    editBucketMetadata(bucketMetadataId, editedBucketData);
    handleClose();
  };

  // Fetch bucket information again if dialog is opened
  useEffect(() => {
    (async () => {
      const metadata = await getBucketMetadata(bucketMetadataId);
      setBucketName(metadata.name);
      setRecurrencePeriod(metadata.recurrence_period_type);
      if (metadata.spending_limit) {
        setRawSpendingLimit((metadata.spending_limit).toString());
      } else {
        setRawSpendingLimit("");
      }
    })();
  }, [bucketMetadataId]);

  return (
    <Dialog
      open={true}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Edit Bucket</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit}
          id="edit-bucket-form"
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
                setRecurrencePeriod(Number(e.target.value));
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
        <Button
          type="submit"
          form="edit-bucket-form"
          variant="contained"
          disabled={!formValid}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
