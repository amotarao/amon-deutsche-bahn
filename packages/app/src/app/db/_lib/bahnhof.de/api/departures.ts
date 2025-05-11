import { getTimetable } from "./common";

export async function getDepartures(evaNumbers: string[]) {
  return getTimetable("departures", evaNumbers);
}
