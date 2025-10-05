export const RecurrencePeriodType = {
  Monthly: 0,
  Weekly: 1,
  Daily: 2,
  Yearly: 3,
  Quarterly: 4,
  SemiAnually: 5,
};

export function getRecurrencePeriodDisplayName(type: RecurrencePeriodType): string {
  switch (type) {
    case RecurrencePeriodType.Monthly:
      return 'monthly';
    case RecurrencePeriodType.Weekly:
      return 'weekly';
    case RecurrencePeriodType.Daily:
      return 'daily';
    case RecurrencePeriodType.Yearly:
      return 'yearly';
    case RecurrencePeriodType.Quarterly:
      return 'quarterly';
    case RecurrencePeriodType.SemiAnually:
      return 'semi-annually';
    default:
      return '';
  }
}

export type RecurrencePeriodType =
  (typeof RecurrencePeriodType)[keyof typeof RecurrencePeriodType];
