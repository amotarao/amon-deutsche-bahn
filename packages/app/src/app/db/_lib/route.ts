import type { Route } from "../_types";

type Response = Route;

export async function getRoute(journeyId: string, cookie: string) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/fahrt");
  url.searchParams.append("journeyId", journeyId);
  url.searchParams.append("poly", "true");

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "accept-encoding": "gzip, deflate, br, zstd",
      "accept-language": "de",
      cookie,
      priority: "u=1, i",
      referer: "https://www.bahn.de/buchung/abfahrten-ankuenfte",
      "sec-ch-ua":
        '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      "x-correlation-id":
        "c0c7e5d2-71ae-4a3e-9847-b94da6b818d3_57d9f180-a207-45d8-8300-798b7fb5670d",
    },
  });
  const json = await response.json();
  return json as Response;
}
