import { expect, test } from "vitest";
import { getRecurrencePeriodDisplayName } from "./Bucket";

test("test all display names", () => {
  expect(getRecurrencePeriodDisplayName(0)).toBe("monthly");
  expect(getRecurrencePeriodDisplayName(5)).toBe("semi-annually");
});
