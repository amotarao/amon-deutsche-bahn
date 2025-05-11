import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Europe/Berlin";
const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm";

export function getCurrentGermanyDate(): string {
  return dayjs().tz(tz).format(dateFormat);
}

export function formatGermanyDate(date: string): string {
  return dayjs.tz(date, tz).format(dateFormat);
}

export function getCurrentGermanyTime(): string {
  return dayjs().tz(tz).format(timeFormat);
}

export function formatGermanyTime(date: string): string {
  return dayjs.tz(date, tz).format(timeFormat);
}
