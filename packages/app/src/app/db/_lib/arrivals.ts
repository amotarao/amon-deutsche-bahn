import type { Arrival } from "../_types";
import {
  getCurrentGermanyDate,
  getCurrentGermanyTime,
} from "../_utils/datetime";

type Params = {
  date?: string | null;
  time?: string | null;
  ortId: string;
  ortExtId: string;
};

type Response = {
  entries?: Arrival[];
};

export async function getArrivals({ date, time, ortId, ortExtId }: Params) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/ankuenfte");
  url.searchParams.append("datum", date || getCurrentGermanyDate());
  url.searchParams.append("zeit", `${time || getCurrentGermanyTime()}:00`);
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
