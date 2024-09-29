import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getRomaniaDate = (): string => {
  return dayjs().tz("Europe/Bucharest").format("YYYY-MM-DD");
};

export const getRomaniaTime = (): string => {
  return dayjs().tz("Europe/Bucharest").format("HH:mm");
};
