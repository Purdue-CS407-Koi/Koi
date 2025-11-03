export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const convertToLocalTime = (date: string) => {
  const converted = new Date(`${date.split("+")[0]}Z`);
  const year = converted.getFullYear();
  const month = String(converted.getMonth() + 1).padStart(2, "0");
  const day = String(converted.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
