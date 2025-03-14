import { type Params, type Response, responseSchema } from "./types.js";

export async function fetchStationSearch(
  { query }: Params,
  { requestInit }: { requestInit?: RequestInit } = {},
): Promise<Response> {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/orte");
  url.searchParams.set("suchbegriff", query);
  url.searchParams.set("typ", "ALL");
  url.searchParams.set("limit", "20");

  const res = await fetch(url, requestInit);
  const json = await res.json();

  const result = responseSchema.safeParse(json);
  if (result.error) throw result.error;

  return result.data;
}
