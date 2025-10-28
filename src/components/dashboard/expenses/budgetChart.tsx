import { COLOR_PRIMARY, COLOR_SECONDARY_CONTAINER } from "@/config/colors";
import { useBuckets } from "@/hooks/useBuckets";
import useExpenses from "@/hooks/useExpenses";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { PieChart } from "@mui/x-charts/PieChart";

const chartSettings = {
  margin: { right: 5 },
  width: 280,
  height: 280,
  hideLegend: true,
};

export const BudgetChart = () => {
  const { expenseData } = useExpenses();
  const { bucketMetadataData } = useBuckets();
  const currentBucketMetadataId = useBucketsStore(
    (state) => state.currentBucketMetadataId
  );
  const currentBucketMetadata = bucketMetadataData?.find(
    (bucket) => bucket.id == currentBucketMetadataId
  );
  const bucketLimit = currentBucketMetadata
    ? currentBucketMetadata.spending_limit
    : 0;
  const total = expenseData?.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  const remaining = bucketLimit! - total;

  const chartData = [
    { label: "Spent", value: total, color: COLOR_PRIMARY },
    { label: "Remaining", value: remaining, color: COLOR_SECONDARY_CONTAINER },
  ];

  return (
    <div className="relative">
      <PieChart
        series={[
          {
            innerRadius: 90,
            outerRadius: 120,
            paddingAngle: 3,
            cornerRadius: 10,
            data: chartData,
            valueFormatter: ({ value }) => `$${value}`,
          },
        ]}
        {...chartSettings}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4/5">
        <p
          className={`font-bold p-1 pt-2 text-3xl ${
            remaining < 0 ? "text-[var(--color-error)]" : "text-black"
          }`}
        >
          ${total}
        </p>
        <p className="font-medium p-1 text-center">Spent</p>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-xl">${bucketLimit}</p>
          <p className="font-medium">Limit</p>
        </div>
        <div className="flex flex-col">
          {remaining > 0 ? (
            <p className="font-bold text-xl">${remaining}</p>
          ) : (
            <p className="font-bold text-xl text-[var(--color-error)]">
              -${remaining * -1}
            </p>
          )}
          <p className="font-medium">Remaining</p>
        </div>
      </div>
    </div>
  );
};
