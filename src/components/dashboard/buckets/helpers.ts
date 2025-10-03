export const getSpendingLimit = (rawSpendingLimit: string): number | null => {
  const parsed = parseFloat(rawSpendingLimit);
  return isNaN(parsed) ? null : parsed;
};

export const getSpendingLimitErrorText = (
  rawSpendingLimit: string
): string | null => {
  if (rawSpendingLimit.length > 0 && !/^[0-9.]*$/.test(rawSpendingLimit)) {
    return "Non-numeric character not allowed";
  }

  const decimalIndex = rawSpendingLimit.indexOf(".");
  if (decimalIndex !== -1 && rawSpendingLimit.length - decimalIndex - 1 > 2) {
    return "Too many decimal places";
  }

  return null;
};
