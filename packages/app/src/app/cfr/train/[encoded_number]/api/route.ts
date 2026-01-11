import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ApiResponse, Station } from "../_types";
import { getRomaniaDate } from "../../../_lib/time";
import { parseDelay, parsePlatform } from "../../../_lib/utils";

dayjs.extend(customParseFormat);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const originalNumber = url.pathname.split("/")[3];

  if (!originalNumber) return Response.json({});

  const number = decodeURIComponent(originalNumber);
  const date = dayjs(
    url.searchParams.get("date") ?? dayjs().format("YYYY-MM-DD"),
  ).format("DD/MM/YYYY");

  const { ConfirmationKey, __RequestVerificationToken } = await getKeyAndToken(
    number,
    date,
  );

  const requestBodyObj = new URLSearchParams();
  requestBodyObj.set("Date", date + " 00:00:00");
  requestBodyObj.set("TrainRunningNumber", number);
  requestBodyObj.set("SelectedBranchCode", "");
  requestBodyObj.set("ReCaptcha", "");
  requestBodyObj.set("ConfirmationKey", ConfirmationKey);
  requestBodyObj.set("IsSearchWanted", "False");
  requestBodyObj.set("IsReCaptchaFailed", "False");
  requestBodyObj.set("__RequestVerificationToken", __RequestVerificationToken);

  const res = await fetch(
    "https://mersultrenurilor.infofer.ro/en-GB/Trains/TrainsResult",
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

  const stations = parseStations(html);
  return Response.json({
    name: parseName(html),
    stations,
  } satisfies ApiResponse);
}

async function getKeyAndToken(number: string, date: string) {
  const url = new URL(
    `https://mersultrenurilor.infofer.ro/en-GB/Train/${number}`,
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

function parseStations(html: string): Station[] {
  const $ = cheerio.load(html);

  const stations = $(".mt-3 .list-group li.list-group-item")
    .toArray()
    .map((element): Station => {
      const $element = $(element);

      const name = $element.find(".col-md-5 a").text().trim();
      const date =
        $element.find(".col-md-5 a").attr("href")?.split("Date=")[1] ?? "";
      const dateObj = dayjs(date, "DD/MM/YYYY");
      const dateYmd = dateObj.isValid()
        ? dateObj.format("YYYY-MM-DD")
        : getRomaniaDate();
      const platform = $element
        .find(".col-6.col-md-8 .col-md-2:last-child")
        .text()
        .trim();

      const arrivalElement = $element.find(".col-3.col-md-2:first-child");
      const arrivalTime = arrivalElement.find(".text-1-3rem").text().trim();
      const arrivalDelay = arrivalElement.find(".text-0-8rem").text().trim();

      const arrival = arrivalTime
        ? {
            date: dateYmd,
            time: arrivalTime,
            delay: parseDelay(arrivalDelay),
            platform: parsePlatform(platform),
          }
        : null;

      const departureElement = $element.find(".col-3.col-md-2:last-child");
      const departureTime = departureElement.find(".text-1-3rem").text().trim();
      const departureDelay = departureElement
        .find(".text-0-8rem")
        .text()
        .trim();

      const departure = departureTime
        ? {
            date: dateYmd,
            time: departureTime,
            delay: parseDelay(departureDelay),
            platform: parsePlatform(platform),
          }
        : null;

      // 型解決
      if (arrival && departure) return { name, arrival, departure };
      if (arrival) return { name, arrival, departure };
      if (departure) return { name, arrival, departure };

      throw new Error();
    });

  return stations;
}

function parseName(html: string): string {
  const $ = cheerio.load(html);
  return ($("h2").text().split(" in ")[0] ?? "")
    .trim()
    .replace(/(\t|\s)+/, " ");
}
