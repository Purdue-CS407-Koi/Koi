import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import useExpenses from "@/hooks/useExpenses";
import { useBuckets } from "@/hooks/useBuckets";
import { useBucketsStore } from "@/stores/useBucketsStore";
import { convertToLocalTime, getDateRange } from "@/helpers/utilities";
import { COLOR_PRIMARY } from "@/config/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export const SpendingOverTimeChart = () => {
  const { expenseData } = useExpenses();
  const { bucketInstanceData } = useBuckets();
  const currentBucketInstanceId = useBucketsStore(
    (state) => state.currentBucketInstanceId
  );

  const currentBucketInstanceData = bucketInstanceData?.find(
    (instance: any) => instance.id == currentBucketInstanceId
  );

  const instanceStart = convertToLocalTime(currentBucketInstanceData!.start);
  const instanceEnd = convertToLocalTime(currentBucketInstanceData!.end);

  const allDates = getDateRange(instanceStart, instanceEnd);

  const spendingByDate: Record<string, number> = {};
  allDates.forEach((d) => {
    spendingByDate[d] = 0;
  });
  expenseData?.forEach((e) => {
    const date = e.created_at;
    if (spendingByDate[date] !== undefined) {
      spendingByDate[date] += e.amount;
    }
  });

  const data = {
    labels: allDates,
    datasets: [
      {
        label: "Total Spending",
        data: allDates.map((d) => spendingByDate[d]),
        borderColor: COLOR_PRIMARY,
        backgroundColor: COLOR_PRIMARY,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <Line data={data} options={options} />
      <p className="font-bold text-xl text-center">Expenses Over Time</p>
    </div>
  );
};
