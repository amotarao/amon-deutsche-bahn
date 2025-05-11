import type { Response } from "../types";

export async function getTimetable(
  type: "departures" | "arrivals",
  evaNumbers: string[],
) {
  const url = new URL(`https://www.bahnhof.de/api/boards/${type}`);
  evaNumbers.forEach((evaNumber) => {
    url.searchParams.append("evaNumbers", evaNumber);
  });
  const transportTypes = [
    "HIGH_SPEED_TRAIN",
    "INTERCITY_TRAIN",
    "INTER_REGIONAL_TRAIN",
    "REGIONAL_TRAIN",
    "CITY_TRAIN",
  ];
  transportTypes.forEach((type) => {
    url.searchParams.append("filterTransports", type);
  });
  url.searchParams.append("duration", "360");
  url.searchParams.append("locale", "de");
  url.searchParams.append("sortBy", "TIME_SCHEDULE");

  const response = await fetch(url);
  const data = await response.json();
  return data as Response;
}
