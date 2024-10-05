import type { DepartureArrival } from "../_types";

export type FetchApiParams = {
  stationCode: string;
  dateUnix: number;
};

export const fetchApi = async ({
  stationCode,
  dateUnix,
}: FetchApiParams): Promise<DepartureArrival> => {
  const url = new URL("/uk/station/api", process.env.NEXT_PUBLIC_BASE_URL);

  url.searchParams.set("station-code", stationCode);
  url.searchParams.set("date-unix", dateUnix.toString());

  const res = await fetch(url);
  const data = (await res.json()) as DepartureArrival;
  return data;
};
