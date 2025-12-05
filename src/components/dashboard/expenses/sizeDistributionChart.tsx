import useExpenses from "@/hooks/useExpenses";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { COLOR_PRIMARY } from "@/config/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const buckets = [
  { label: "$0-$50", min: 0, max: 50 },
  { label: "$50-$100", min: 50, max: 100 },
  { label: "$100-$500", min: 100, max: 500 },
  { label: "$500-$1000", min: 500, max: 1000 },
  { label: "$1000+", min: 1000, max: Infinity },
];

export const ExpenseSizesChart = () => {
  const { expenseData } = useExpenses();
  const counts = buckets.map(
    (bucket) =>
      expenseData?.filter(
        (e) => e.amount >= bucket.min && e.amount < bucket.max
      ).length
  );

  const data = {
    labels: buckets.map((b) => b.label),
    datasets: [
      {
        label: "Number of Expenses",
        data: counts,
        backgroundColor: COLOR_PRIMARY,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // hide legend
      },
      title: {
        display: false, // remove title
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // remove X gridlines
        },
      },
      y: {
        grid: {
          display: false, // remove Y gridlines
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <p className="font-bold text-xl text-center">Expense Size Distribution</p>
      <Bar data={data} options={options} />
    </div>
  );
};
