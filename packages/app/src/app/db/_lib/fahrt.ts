import type { Fahrt } from "../_types";

type Response = Fahrt;

export async function getFahrt(journeyId: string) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/fahrt");
  url.searchParams.append("journeyId", journeyId);
  url.searchParams.append("poly", "true");

  const response = await fetch(url);
  const json = await response.json();
  return json as Response;
}
