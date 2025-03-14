import { type Params, type Response, responseSchema } from "./types.js";

export async function fetchStationSearch(
  { query }: Params,
  { requestInit }: { requestInit?: RequestInit } = {},
): Promise<Response> {
  const url = new URL("https://www.cd.cz/wsapi/api/whisperer/Stations");
  url.searchParams.set("count", "20");
  url.searchParams.set("prefixText", query);
  url.searchParams.set("lang", "cs");
  url.searchParams.set("combination", "");
  url.searchParams.set("searchDate", "");
  url.searchParams.set("isNoNad", "false");
  url.searchParams.set("format", "json");

  const res = await fetch(url, requestInit);
  const json = await res.json();

  const result = responseSchema.safeParse(json);
  if (result.error) throw result.error;

  return result.data;
}
