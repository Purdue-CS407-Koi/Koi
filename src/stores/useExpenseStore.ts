import { create } from "zustand";

interface ExpenseStore {
  currentExpenseId: string;
  setCurrentExpenseId: (expenseId: string) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  currentExpenseId: "f4893a0f-0832-4d12-a55a-62c457102b29",
  setCurrentExpenseId: (challengeId) => set({ currentExpenseId: challengeId }),
}));
