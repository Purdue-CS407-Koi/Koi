import { expect, test } from "vitest";
import {
  getRecurrencePeriodDisplayName,
  getStartDate,
  getEndDate,
  RecurrencePeriodType,
} from "./Bucket";

test("test all display names", () => {
  expect(getRecurrencePeriodDisplayName(0)).toBe("monthly");
  expect(getRecurrencePeriodDisplayName(5)).toBe("semi-annually");
});

test("test daily bucket periods", () => {
  const date = new Date(2025, 9, 24, 13, 52, 48, 141);
  const recurrencePeriod = RecurrencePeriodType.Daily;
  expect(getStartDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 9, 24, 0, 0, 0, 0),
  );
  expect(getEndDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 9, 24, 23, 59, 59, 999),
  );
});

test("test monthly bucket periods", () => {
  const date = new Date(2025, 9, 24, 13, 52, 48, 141);
  const recurrencePeriod = RecurrencePeriodType.Monthly;
  expect(getStartDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 9, 1, 0, 0, 0, 0),
  );
  expect(getEndDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 9, 31, 23, 59, 59, 999),
  );
});

test("test yearly bucket periods", () => {
  const date = new Date(2025, 9, 24, 13, 52, 48, 141);
  const recurrencePeriod = RecurrencePeriodType.Yearly;
  expect(getStartDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 0, 1, 0, 0, 0, 0),
  );
  expect(getEndDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 11, 31, 23, 59, 59, 999),
  );
});

test("test quarterly bucket periods", () => {
  const date = new Date(2025, 9, 24, 13, 52, 48, 141);
  const recurrencePeriod = RecurrencePeriodType.Quarterly;
  expect(getStartDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 9, 1, 0, 0, 0, 0),
  );
  expect(getEndDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 11, 31, 23, 59, 59, 999),
  );
});

test("test semi-annual bucket periods", () => {
  const date = new Date(2025, 9, 24, 13, 52, 48, 141);
  const recurrencePeriod = RecurrencePeriodType.SemiAnually;
  expect(getStartDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 6, 1, 0, 0, 0, 0),
  );
  expect(getEndDate(date, recurrencePeriod)).toStrictEqual(
    new Date(2025, 11, 31, 23, 59, 59, 999),
  );
});
