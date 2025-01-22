import type { Ort } from "../types";

type Response = Ort[];

export async function searchOrte(q: string) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/orte");
  url.searchParams.append("suchbegriff", q);
  url.searchParams.append("type", "ALL");
  url.searchParams.append("limit", "10");

  const response = await fetch(url);
  const json = await response.json();
  return json as Response;
}
