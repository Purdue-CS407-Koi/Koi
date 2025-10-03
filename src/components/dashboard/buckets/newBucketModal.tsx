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

const NewBucketModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [recurrencePeriod, setRecurrencePeriod] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    const newBucket = {
      name: formJson.name,
      recurrencePeriod: formJson["recurrence-period"],
      spendingLimit: formJson["spending-limit"],
    };

    console.log("Would've created bucket ", newBucket);

    // TODO: actually mutate store here!

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => {
      setOpen(false);
    }}>
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
              margin="dense"
              id="spending-limit"
              name="spending-limit"
              label="Spending Limit"
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
