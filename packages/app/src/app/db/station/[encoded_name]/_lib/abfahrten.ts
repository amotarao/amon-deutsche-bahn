import {
  getGermanyDate,
  getGermanyTime,
} from "../../../../../modules/fetch-api/timetable";
import type { Abfahrt } from "../types";

type Params = {
  date?: string | null;
  time?: string | null;
  ortId: string;
  ortExtId: string;
};

type Response = {
  entries: Abfahrt[];
};

export async function getAbfahrten({ date, time, ortId, ortExtId }: Params) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/abfahrten");
  url.searchParams.append("datum", date || getGermanyDate());
  url.searchParams.append("zeit", time ? `${time}:00` : getGermanyTime());
  url.searchParams.append("ortId", ortId);
  url.searchParams.append("ortExtId", ortExtId);
  url.searchParams.append("mitVias", "true");
  url.searchParams.append("maxVias", "8");
  ["ICE", "EC_IC", "IR", "REGIONAL", "SBAHN"].forEach((v) => {
    url.searchParams.append("verkehrsmittel", v);
  });

  const response = await fetch(url);
  const json = await response.json();
  return json as Response;
}
