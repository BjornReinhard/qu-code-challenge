export const isNumericString = (stringToNumber: string | undefined | null) => {
  return (
    stringToNumber !== undefined &&
    stringToNumber !== null &&
    !isNaN(parseFloat(stringToNumber)) &&
    isFinite(Number(stringToNumber))
  );
};

export const safeNumber = (
  valueToNumber: number | string | undefined | null,
  defaultReturn = -1,
) => {
  if (typeof valueToNumber === 'number') {
    return valueToNumber;
  }

  if (isNumericString(valueToNumber)) {
    return Number(valueToNumber);
  }

  return defaultReturn;
};
