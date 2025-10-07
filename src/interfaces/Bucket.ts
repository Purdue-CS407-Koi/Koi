import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
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
  type: RecurrencePeriodType
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

export const getEndDate = (
  startDate: Date,
  period: RecurrencePeriodType
): Date => {
  switch (period) {
    case RecurrencePeriodType.Monthly:
      return addMonths(startDate, 1);
    case RecurrencePeriodType.Weekly:
      return addWeeks(startDate, 1);
    case RecurrencePeriodType.Daily:
      return addDays(startDate, 1);
    case RecurrencePeriodType.Yearly:
      return addYears(startDate, 1);
    case RecurrencePeriodType.Quarterly:
      return addQuarters(startDate, 1);
    case RecurrencePeriodType.SemiAnually:
      return addYears(startDate, 0.5);
  }
};

export const getStartDate = (
  endDate: Date,
  period: RecurrencePeriodType
): Date => {
  switch (period) {
    case RecurrencePeriodType.Monthly:
      return subMonths(endDate, 1);
    case RecurrencePeriodType.Weekly:
      return subWeeks(endDate, 1);
    case RecurrencePeriodType.Daily:
      return subDays(endDate, 1);
    case RecurrencePeriodType.Yearly:
      return subYears(endDate, 1);
    case RecurrencePeriodType.Quarterly:
      return subQuarters(endDate, 1);
    case RecurrencePeriodType.SemiAnually:
      return subYears(endDate, 0.5);
  }
};
