import type { NextApiHandler, NextApiRequest } from "next";
import { stringifyQuery } from "../../../utils/api/format";
import type {
  Journey,
  JourneyWithArrivalDepartureInformation,
  TimetableResponse,
  TimetableWithArrivalDepartureResponse,
} from "../../../utils/api/timetable/types";

const fetchJourneys = async (
  query: NextApiRequest["query"],
  type: "dep" | "arr",
): Promise<TimetableResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable`);
  url.searchParams.set(
    "id",
    stringifyQuery(query, "id") || stringifyQuery(query, "station", true),
  );
  url.searchParams.set("date", stringifyQuery(query, "date", true));
  url.searchParams.set("time", stringifyQuery(query, "time", true));
  "trainType" in query &&
    url.searchParams.set("trainType", stringifyQuery(query, "trainType"));
  url.searchParams.set("type", type);

  const resp = await fetch(url.href);
  const json = (await resp.json()) as TimetableResponse;
  return json;
};

const api: NextApiHandler = async (req, res) => {
  const [depRes, arrRes] = await Promise.all([
    fetchJourneys(req.query, "dep"),
    fetchJourneys(req.query, "arr"),
  ]);
  const {
    data: { journeyItems: depJourneys, ...baseData },
  } = depRes;
  const {
    data: { journeyItems: arrJourneys },
  } = arrRes;

  const baseJourneys: JourneyWithArrivalDepartureInformation[] =
    arrJourneys.map((journey) => {
      const { information, ...data } = journey;
      return {
        ...data,
        arrivalInformation: information,
        departureInformation: null,
      };
    });

  depJourneys.forEach((depJourney) => {
    const target = baseJourneys.find((arrJourney) => {
      // 既にマッチングが済んでいるもの
      if (arrJourney.departureTime || arrJourney.departureActualTime) {
        return false;
      }

      // 列車名自体が違うもの
      if (arrJourney.train !== depJourney.train) {
        return false;
      }

      // ホームの記載がないもの
      // ただし、おそらく同じ列車なものを除く
      if (
        (!arrJourney.platform || !depJourney.platform) &&
        !isMaybeSameTrain(arrJourney)
      ) {
        return false;
      }

      // イギリスの列車名不明
      if (arrJourney.train === "---") {
        return false;
      }

      // S-Bahn
      if (arrJourney.train.match(/^S(\s*\d+)?$/)) {
        if (
          arrJourney.platform === depJourney.platform &&
          arrJourney.origin !== depJourney.destination &&
          timeToNumberForCalc(arrJourney.arrivalTime || "") <=
            timeToNumberForCalc(depJourney.departureTime || "") &&
          timeToNumberForCalc(depJourney.departureTime || "") <=
            timeToNumberForCalc(arrJourney.arrivalTime || "") + 5
        ) {
          return true;
        }
        return false;
      }

      return true;
    });

    if (target) {
      target.departureTime = depJourney.departureTime;
      target.departureActualTime = depJourney.departureActualTime;
      target.departureDelayed = depJourney.departureDelayed;
      target.destination = depJourney.destination;
      target.stops = [...target.stops, ...depJourney.stops];
      target.departureInformation = depJourney.information;
      return;
    }

    const { information, ...data } = depJourney;
    const j = {
      ...data,
      arrivalInformation: null,
      departureInformation: information,
    };
    baseJourneys.push(j);
  });

  const json: TimetableWithArrivalDepartureResponse = {
    data: {
      journeyItems: baseJourneys.sort((a, z) => {
        const aTime = Number.parseInt(
          (
            a.arrivalActualTime ||
            a.arrivalTime ||
            a.departureActualTime ||
            a.departureTime
          )?.replace(/:/, "") ?? "0",
          10,
        );
        const zTime = Number.parseInt(
          (
            z.arrivalActualTime ||
            z.arrivalTime ||
            z.departureActualTime ||
            z.departureTime
          )?.replace(/:/, "") ?? "0",
          10,
        );
        return aTime - zTime;
      }),
      ...baseData,
    },
  };

  res.status(200).json(json);
};

export default api;

const timeToNumberForCalc = (time: string): number => {
  const [, h, m] = time.match(/(\d+):(\d+)/) || ["0", "0", "0"];
  const num = Number.parseInt(h, 10) * 60 + Number.parseInt(m, 10);
  return num;
};

const isMaybeSameTrain = (
  arr: JourneyWithArrivalDepartureInformation,
): boolean => {
  const france = ["TGV", "THA", "OGV"].includes(arr.train.slice(0, 3));
  if (france) return true;

  const matches = arr.train.split(" ");
  if (matches) {
    const same =
      matches.length === 2 &&
      matches[0].match(/^[A-Za-z]{1,4}$/) &&
      matches[1].match(/^\d{3,5}$/);
    if (same) return true;
  }

  return false;
};
