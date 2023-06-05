import { subDays, format } from "date-fns";
const DATEFORMAT = "yyyy-MM-dd";
const PAKDATEFORMAT = "dd-MM-yyyy";
const DATEFORMATwITHTIME = `${DATEFORMAT} HH:mm:ss`;

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

  const startDateFormatted = format(startDate, DATEFORMAT);
  const endDateFormatted =
    days === 1 ? format(endDate, DATEFORMATwITHTIME) : format(endDate, DATEFORMAT);

  return {
    startDate: startDateFormatted,
    endDate: endDateFormatted,
  };
}
export function getCustomDate(startDate, endDate) {
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  const formattedStartDate = format(startDateObject, DATEFORMAT);
  const formattedEndDate = format(endDateObject, DATEFORMAT);

  return { startDate: formattedStartDate, endDate: formattedEndDate };
}

export function getDate(date) {
  const state = format(date, DATEFORMAT);
  return state;
}

export function dateFormat(inputDate) {
  const stringDate = new Date(inputDate);
  const formattedDate = format(stringDate, PAKDATEFORMAT);
  return formattedDate;
}

export function getNewUpdate(update1, update2) {
  return new Date(update1) > new Date(update2) ? update1 : update2;
}

export function isTruthy(value) {
  return !["", " ", "null", null, "undefined", undefined, false, "false", 0, "invalid"].includes(
    value
  );
}

export function isNotTruthy(value) {
  return ["", " ", "null", null, "undefined", undefined, false, "false", 0, "invalid"].includes(
    value
  );
}
