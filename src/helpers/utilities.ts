import type { Expense } from "@/interfaces/Expense";

export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const convertToLocalTime = (date: string) => {
  const converted = new Date(`${date.split("+")[0]}Z`);
  const year = converted.getFullYear();
  const month = String(converted.getMonth() + 1).padStart(2, "0");
  const day = String(converted.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertToLocalTimeFull = (date: string) => {
  const converted = new Date(`${date.split("+")[0]}Z`);
  const year = converted.getFullYear();
  const month = String(converted.getMonth() + 1).padStart(2, "0");
  const day = String(converted.getDate()).padStart(2, "0");

  let hours = converted.getHours();
  const minutes = String(converted.getMinutes()).padStart(2, "0");
  const seconds = String(converted.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
};

export const getDateRange = (start: string, end: string) => {
  const dates: string[] = [];

  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);

  let current = new Date(startYear, startMonth - 1, startDay);
  const endD = new Date(endYear, endMonth - 1, endDay);

  while (current <= endD) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export function calculateExpenseStats(expenses: Expense[]) {
  if (expenses.length === 0) {
    return {
      averageDailySpending: 0,
      averageExpenseSize: 0,
      largestExpense: null,
    };
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const averageExpenseSize = totalSpent / expenses.length;

  const largestExpense = expenses.reduce((max, e) =>
    e.amount > max.amount ? e : max
  );

  const spendingByDay: Record<string, number> = {};

  for (const e of expenses) {
    const d = new Date(e.created_at);
    const key = d.toISOString().slice(0, 10);
    spendingByDay[key] = (spendingByDay[key] || 0) + e.amount;
  }

  const numDays = Object.keys(spendingByDay).length;
  const averageDailySpending = totalSpent / numDays;

  return {
    averageDailySpending,
    averageExpenseSize,
    largestExpense,
  };
}
