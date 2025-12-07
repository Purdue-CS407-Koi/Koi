import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { Button } from "@mui/material";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Value = Date | null;

interface EditExpenseDateProps {
  value: Value;
  setValue: (value: Value) => void;
}

export const EditExpenseDate = ({ value, setValue }: EditExpenseDateProps) => {
  const [open, setOpen] = useState(false);

  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const { bucketInstanceData } = useBuckets();

  const currentInstance = bucketInstanceData?.find(
    (x) => x.id === currentBucketInstanceId
  );

  const onChange = (date: Value | any) => {
    setValue(date);
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen((prev) => !prev)} variant="contained">
        Change Date
      </Button>
      <p className="my-3">
        Selected date: {value!.toISOString().split("T")[0]}
      </p>
      {open && (
        <Calendar
          onChange={onChange}
          value={value}
          minDate={new Date(currentInstance!.start)}
          maxDate={new Date(currentInstance!.end)}
        />
      )}
    </div>
  );
};
