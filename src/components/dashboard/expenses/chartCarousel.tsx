import { useState } from "react";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { BudgetChart } from "./budgetChart";
import { ExpenseSizesChart } from "./sizeDistributionChart";

export const ChartCarousel = () => {
  const [index, setIndex] = useState(0);

  const prevChart = () => setIndex((prev) => (prev === 0 ? 2 : prev - 1));
  const nextChart = () => setIndex((prev) => (prev === 2 ? 0 : prev + 1));

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <IconButton onClick={prevChart}>
          <ArrowBack />
        </IconButton>

        <div className="w-[300px] h-[300px]">
          {index === 0 && <BudgetChart />}
          {index === 1 && <ExpenseSizesChart />}
        </div>

        <IconButton onClick={nextChart}>
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
};
