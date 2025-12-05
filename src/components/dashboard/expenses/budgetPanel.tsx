import { Select, MenuItem, FormControl } from "@mui/material";
import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { RecurringExpensesSection } from "./recurringExpensesSection";
import { convertToLocalTime } from "@/helpers/utilities";
import { ChartCarousel } from "./charts/chartCarousel";

export const BudgetPanel = () => {
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );
  const setCurrentBucketInstanceId = useBucketsStore(
    (state) => state.setCurrentBucketInstanceId
  );
  const { bucketInstanceData } = useBuckets();

  return (
    <div className="flex-2 p-5">
      <p className="text-xl font-medium">Budget</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <p className="text-sm self-center">Current Period: </p>
          <FormControl size="small">
            <Select
              labelId="dropdown-label"
              id="dropdown"
              value={currentBucketInstanceId ?? ""}
              onChange={(event) =>
                setCurrentBucketInstanceId(event.target.value as string)
              }
              sx={{ fontSize: "14px" }}
            >
              {bucketInstanceData?.map((data) => (
                <MenuItem
                  key={data.id}
                  value={data.id}
                  sx={{ fontSize: "14px" }}
                >
                  {convertToLocalTime(data.start)} to{" "}
                  {convertToLocalTime(data.end)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <ChartCarousel />
        <RecurringExpensesSection />
      </div>
    </div>
  );
};
