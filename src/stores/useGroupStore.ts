import { create } from "zustand";

interface GroupStore {
  currentGroupId: string;
  setCurrentGroupId: (groupId: string) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  currentGroupId: "2bece609-4488-4216-b80b-9af362e0b613",
  setCurrentGroupId: (groupId) => set({ currentGroupId: groupId }),
}));
