import { create } from "zustand";

interface ExpenseStore {
  currentExpenseId: string | null;
  setCurrentExpenseId: (expenseId: string) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  currentExpenseId: null,
  setCurrentExpenseId: (expenseId) => set({ currentExpenseId: expenseId }),
}));
