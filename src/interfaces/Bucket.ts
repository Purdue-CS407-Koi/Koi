import {
  startOfMonth,
  startOfWeek,
  startOfDay,
  startOfYear,
  startOfQuarter,
  endOfMonth,
  endOfWeek,
  endOfDay,
  endOfYear,
  endOfQuarter,
} from "date-fns";

export const RecurrencePeriodType = {
  Monthly: 0,
  Weekly: 1,
  Daily: 2,
  Yearly: 3,
  Quarterly: 4,
  SemiAnually: 5,
} as const;

export const getRecurrencePeriodDisplayName = (
  type: RecurrencePeriodType,
): string => {
  switch (type) {
    case RecurrencePeriodType.Monthly:
      return "monthly";
    case RecurrencePeriodType.Weekly:
      return "weekly";
    case RecurrencePeriodType.Daily:
      return "daily";
    case RecurrencePeriodType.Yearly:
      return "yearly";
    case RecurrencePeriodType.Quarterly:
      return "quarterly";
    case RecurrencePeriodType.SemiAnually:
      return "semi-annually";
    default:
      return "";
  }
};

export type RecurrencePeriodType =
  (typeof RecurrencePeriodType)[keyof typeof RecurrencePeriodType];

// Get the start date of the recurrence period based on the current/end date
export const getStartDate = (
  date: Date,
  period: RecurrencePeriodType,
): Date => {
  switch (period) {
    case RecurrencePeriodType.Monthly:
      return startOfMonth(date);
    case RecurrencePeriodType.Weekly:
      return startOfWeek(date);
    case RecurrencePeriodType.Daily:
      return startOfDay(date);
    case RecurrencePeriodType.Yearly:
      return startOfYear(date);
    case RecurrencePeriodType.Quarterly:
      return startOfQuarter(date);
    case RecurrencePeriodType.SemiAnually: {
      // Find month based on year half
      const month = date.getMonth() < 6 ? 0 : 6;
      return new Date(date.getFullYear(), month, 1, 0, 0, 0, 0);
    }
  }
};

// Get the end date of the recurrence period based on the current/start date
export const getEndDate = (date: Date, period: RecurrencePeriodType): Date => {
  switch (period) {
    case RecurrencePeriodType.Monthly:
      return endOfMonth(date);
    case RecurrencePeriodType.Weekly:
      return endOfWeek(date);
    case RecurrencePeriodType.Daily:
      return endOfDay(date);
    case RecurrencePeriodType.Yearly:
      return endOfYear(date);
    case RecurrencePeriodType.Quarterly:
      return endOfQuarter(date);
    case RecurrencePeriodType.SemiAnually: {
      if (date.getMonth() < 6) {
        return new Date(date.getFullYear(), 5, 30, 23, 59, 59, 999);
      }
      return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
  }
};
