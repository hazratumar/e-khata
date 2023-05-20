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
export function getNewUpdate(update1, update2) {
  return new Date(update1) > new Date(update2) ? update1 : update2;
}
