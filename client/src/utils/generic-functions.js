import { subDays, format } from "date-fns";
import numeral from "numeral";
const DATEFORMAT = "yyyy-MM-dd";
const PAKDATEFORMAT = "dd MMMM, yyyy";

export const getDateRange = (days) => {
  const today = new Date();
  let startDate = new Date(today);
  let endDate = new Date(today);

  if (days === 7) {
    startDate = subDays(today, 6);
  } else if (days === 30) {
    startDate = subDays(today, 29);
  } else if (days === 365) {
    startDate = subDays(today, 364);
  }

  const startDateFormatted = format(startDate, DATEFORMAT);
  const endDateFormatted = format(endDate, DATEFORMAT);

  return {
    startDate: startDateFormatted,
    endDate: endDateFormatted,
  };
};
export const getCustomDate = (startDate, endDate) => {
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  const formattedStartDate = format(startDateObject, DATEFORMAT);
  const formattedEndDate = format(endDateObject, DATEFORMAT);

  return { startDate: formattedStartDate, endDate: formattedEndDate };
};

export const getDate = (date) => {
  const formattedDate = format(date, DATEFORMAT);
  return formattedDate;
};

export const dateFormat = (inputDate) => {
  const stringDate = new Date(inputDate);
  const formattedDate = format(stringDate, PAKDATEFORMAT);
  return formattedDate;
};

export const getNewUpdate = (update1, update2) =>
  new Date(update1) > new Date(update2) ? update1 : update2;

export const isTruthy = (value) =>
  !["", " ", "null", null, "undefined", undefined, false, "false", 0, "invalid"].includes(value);

export const isNotTruthy = (value) =>
  ["", " ", "null", null, "undefined", undefined, false, "false", 0, "invalid"].includes(value);

export const getProjectStartDate = () => new Date(2023, 0, 1);

export const formatTwoDecimals = (value) =>
  Number.isInteger(value) ? numeral(value).format("0,0") : numeral(value).format("0,0.00");

export const formatWithAbbreviation = (value) =>
  Number.isInteger(value) ? numeral(value).format("0a") : numeral(value).format("0.0a");
