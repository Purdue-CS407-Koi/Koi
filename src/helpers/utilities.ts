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

export const convertToLocalTimeFull = (date: string) => {
  const converted = new Date(`${date.split("+")[0]}Z`);
  const year = converted.getFullYear();
  const month = String(converted.getMonth() + 1).padStart(2, "0");
  const day = String(converted.getDate()).padStart(2, "0");

  let hours = converted.getHours();
  const minutes = String(converted.getMinutes()).padStart(2, "0");
  const seconds = String(converted.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
};
