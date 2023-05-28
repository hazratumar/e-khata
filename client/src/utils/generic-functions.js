import { subDays, format } from "date-fns";

export function getDateRange(days) {
  const today = new Date();
  let startDate = new Date(today);
  let endDate = new Date(today);

  if (days === 7) {
    startDate = subDays(today, 7);
  } else if (days === 30) {
    startDate = subDays(today, 30);
  } else if (days === 365) {
    startDate = subDays(today, 365);
  }

  const startDateFormatted = format(startDate, "yyyy-MM-dd");
  const endDateFormatted =
    days === 1 ? format(endDate, "yyyy-MM-dd HH:mm:ss") : format(endDate, "yyyy-MM-dd");

  return {
    startDate: startDateFormatted,
    endDate: endDateFormatted,
  };
}
export function getCustomDate(startDate, endDate) {
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  const formattedStartDate = format(startDateObject, "yyyy-MM-dd");
  const formattedEndDate = format(endDateObject, "yyyy-MM-dd");

  return { startDate: formattedStartDate, endDate: formattedEndDate };
}

export function getDate(date) {
  const state = format(date, "yyyy-MM-dd");
  return state;
}
export function getNewUpdate(update1, update2) {
  return new Date(update1) > new Date(update2) ? update1 : update2;
}

export function validate(text) {
  if (
    text === "" ||
    text === " " ||
    text === "null" ||
    text === null ||
    text === "undefined" ||
    text === undefined ||
    text === false ||
    text === "false" ||
    text === 0 ||
    Number.isNaN(text) ||
    text === "invalid"
  ) {
    return false;
  } else {
    return true;
  }
}
