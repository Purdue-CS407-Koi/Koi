import { create } from "zustand";

interface CalendarStore {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  isMultiDaySelected: boolean;
  setIsMultiDaySelected: (isMultiDaySelected: boolean) => void;
}

const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
  isMultiDaySelected: false,
  setIsMultiDaySelected: (isMultiDaySelected) => set({ isMultiDaySelected }),
}));

export default useCalendarStore;
