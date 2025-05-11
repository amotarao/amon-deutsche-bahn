import type { Route } from "../_types";

type Response = Route;

export async function getRoute(journeyId: string) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/fahrt");
  url.searchParams.append("journeyId", journeyId);
  url.searchParams.append("poly", "true");

  const response = await fetch(url);
  const json = await response.json();
  return json as Response;
}
