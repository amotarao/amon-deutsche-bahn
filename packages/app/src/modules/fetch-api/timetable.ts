import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getGermanyDate(date?: string): string {
  if (date) {
    return dayjs.tz(date, "Europe/Berlin").format("YYYY-MM-DD");
  }

  return dayjs().tz("Europe/Berlin").format("YYYY-MM-DD");
}

export function getGermanyTime(date?: string): string {
  if (date) {
    return dayjs.tz(date, "Europe/Berlin").format("HH:mm");
  }

  return dayjs().tz("Europe/Berlin").format("HH:mm");
}
