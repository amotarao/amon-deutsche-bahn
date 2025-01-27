import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getRomaniaDate } from "../../../_lib/time";
import { parseDelay, parsePlatform } from "../../../_lib/utils";
import { getLinkStationName } from "../_lib/station";
import type { ApiResponse, Arrival, Departure, Train } from "../_types";

dayjs.extend(customParseFormat);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const originalName = url.pathname.split("/")[3];

  if (!originalName) return Response.json({});

  const name = getLinkStationName(decodeURIComponent(originalName));
  const date = dayjs(
    url.searchParams.get("date") ?? dayjs().format("YYYY-MM-DD"),
  ).format("DD/MM/YYYY");

  const { ConfirmationKey, __RequestVerificationToken } = await getKeyAndToken(
    name,
    date,
  );

  const requestBodyObj = new URLSearchParams();
  requestBodyObj.set("Date", date + " 00:00:00");
  requestBodyObj.set("StationName", name);
  requestBodyObj.set("ReCaptcha", "");
  requestBodyObj.set("ConfirmationKey", ConfirmationKey);
  requestBodyObj.set("IsSearchWanted", "False");
  requestBodyObj.set("IsReCaptchaFailed", "False");
  requestBodyObj.set("__RequestVerificationToken", __RequestVerificationToken);

  const res = await fetch(
    "https://mersultrenurilor.infofer.ro/en-GB/Stations/StationsResult",
    {
      headers: {
        accept: "*/*",
        "accept-language":
          "de-DE,de;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrerPolicy: "no-referrer",
      body: requestBodyObj.toString(),
      method: "POST",
      mode: "cors",
      credentials: "include",
    },
  );

  const html = await res.text();

  const departures = parseTrains("departure", html, date);
  const arrivals = parseTrains("arrival", html, date);
  const trains = mergeTrains(departures, arrivals);
  return Response.json({
    name: parseName(html),
    trains,
  } satisfies ApiResponse);
}

async function getKeyAndToken(station: string, date: string) {
  const url = new URL(
    `https://mersultrenurilor.infofer.ro/en-GB/Station/${station}`,
  );
  url.searchParams.set("Date", date);

  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);

  return {
    ConfirmationKey:
      $('input[name="ConfirmationKey"]').get(0)?.attribs.value ?? "",
    __RequestVerificationToken:
      $('input[name="__RequestVerificationToken"]').get(0)?.attribs.value ?? "",
  };
}

function parseTrains(
  type: "departure",
  html: string,
  defaultDate: string,
): Departure[];
function parseTrains(
  type: "arrival",
  html: string,
  defaultDate: string,
): Arrival[];
function parseTrains<Type extends "departure" | "arrival">(
  type: Type,
  html: string,
  defaultDate: string,
) {
  const $ = cheerio.load(html);
  const trains = $(`li.list-group-item[id^=li-train-${type}s-]`)
    .toArray()
    .map((element) => {
      const $element = $(element);
      const time = $element
        .find(".col-md-2.col-4")
        .first()
        .find("div")
        .last()
        .text()
        .trim();
      const originOrDestination = $element
        .find(".col-md-3.col-8 a")
        .text()
        .trim();
      const trainCategory = $element
        .find('[class^="span-train-category-"]')
        .text()
        .trim();
      const trainNumber = $element.find(".col-md-2.col-4 a").text().trim();
      const train = (trainCategory + " " + trainNumber).trim();
      const operator = $element.find(".img-train-operator").attr("alt") || "";
      const delay = $element
        .find(".div-stations-train-real-time-badge .d-inline-block:first-child")
        .text()
        .trim();
      const platform = $element
        .find(".div-stations-train-real-time-badge .d-inline-block.ml-3")
        .text()
        .trim();
      const date =
        $element
          .find(".col-md-2.col-4.text-1-1rem a")
          .attr("href")
          ?.split("?Date=")[1] ?? defaultDate;
      const dateObj = dayjs(date, "DD/MM/YYYY");
      const dateYmd = dateObj.isValid()
        ? dateObj.format("YYYY-MM-DD")
        : getRomaniaDate();

      return {
        date: dateYmd,
        time,
        train,
        originOrDestination,
        operator,
        delay: parseDelay(delay),
        platform: parsePlatform(platform),
      };
    });

  const departures = trains.map(
    ({ originOrDestination, ...train }): Departure => ({
      ...train,
      destination: originOrDestination,
    }),
  );
  const arrivals = trains.map(
    ({ originOrDestination, ...train }): Arrival => ({
      ...train,
      origin: originOrDestination,
    }),
  );

  return type === "departure" ? departures : arrivals;
}

function mergeTrains(departures: Departure[], arrivals: Arrival[]): Train[] {
  const trains: Train[] = [];

  departures.forEach((departure) => {
    trains.push({
      train: departure.train,
      operator: departure.operator,
      origin: null,
      destination: departure.destination,
      arrival: null,
      departure: {
        date: departure.date,
        time: departure.time,
        delay: departure.delay,
        platform: departure.platform,
      },
    });
  });

  arrivals.forEach((arrival) => {
    const train = trains.find((train) => train.train === arrival.train);
    if (train) {
      train.origin = arrival.origin;
      train.arrival = {
        date: arrival.date,
        time: arrival.time,
        delay: arrival.delay,
        platform: arrival.platform,
      };
      return;
    }
    trains.push({
      train: arrival.train,
      operator: arrival.operator,
      origin: arrival.origin,
      destination: null,
      arrival: {
        date: arrival.date,
        time: arrival.time,
        delay: arrival.delay,
        platform: arrival.platform,
      },
      departure: null,
    });
  });

  return trains.toSorted((a, z) =>
    (a.arrival?.time ?? a.departure?.time ?? "") >
    (z.arrival?.time ?? z.departure?.time ?? "")
      ? 1
      : -1,
  );
}

function parseName(html: string): string {
  const $ = cheerio.load(html);
  return $("h2 span:first-child").text();
}
