import { getTimetable } from "./common";

export async function getArrivals(evaNumbers: string[]) {
  return getTimetable("arrivals", evaNumbers);
}
