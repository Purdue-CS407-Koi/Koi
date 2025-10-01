export interface BucketMetadata {
  id: string;
  name: string;
  recurrence_period_type: RecurrencePeriodType;
  spending_limit: number;
}

export interface BucketInstance {
  id: string;
  bucket_metadata_id: string;
  start: Date | null;
  end: Date | null;
}

export const RecurrencePeriodType = {
  Monthly: 0,
  Weekly: 1,
  Daily: 2,
  Yearly: 3,
  Quarterly: 4,
  SemiAnually: 5,
};

export type RecurrencePeriodType =
  (typeof RecurrencePeriodType)[keyof typeof RecurrencePeriodType];
