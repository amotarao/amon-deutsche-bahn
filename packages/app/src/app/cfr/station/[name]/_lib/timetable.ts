import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ApiResponse, Train } from "../_types";

export type TimetableRequestQuery = {
  name: string;
  id: string;
  date: string;
  time: string;
  type: string;
  trainType: string[];
};

export const fetchTimetable = async (
  station: string,
  searchParams?: ReadonlyURLSearchParams | null,
): Promise<ApiResponse> => {
  const url = new URL(
    `/cfr/station/${encodeURIComponent(station)}/api`,
    process.env.NEXT_PUBLIC_BASE_URL,
  );

  const date = searchParams?.get("date");
  if (date) {
    url.searchParams.set("date", date);
  }

  const res = await fetch(url);
  const data = (await res.json()) as ApiResponse;
  return data;
};

dayjs.extend(utc);
dayjs.extend(timezone);

export const getRomaniaDate = (): string => {
  return dayjs().tz("Europe/Bucharest").format("YYYY-MM-DD");
};

export const getRomaniaTime = (): string => {
  return dayjs().tz("Europe/Bucharest").format("HH:mm");
};
