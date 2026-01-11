"use server";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ApiResponse, DepartureArrivalData } from "./_types";
import { getArrivalBoard } from "./_lib/arrivalBoard";
import { getDepartureBoard } from "./_lib/departureBoard";

dayjs.extend(customParseFormat);

type Params = {
  stationCode: string;
  dateUnix: string;
};

export async function fetchBoard({
  stationCode,
  dateUnix,
}: Params): Promise<ApiResponse | null> {
  const dateTime = dateUnix
    ? dayjs.unix(Number(dateUnix)).toISOString()
    : dayjs().toISOString();

  if (!stationCode) {
    return null;
  }

  const [departure, arrival] = await Promise.all([
    getDepartureBoard({ stationCode, dateTime }),
    getArrivalBoard({ stationCode, dateTime }),
  ]);
  const data = merge(departure, arrival);
  return data;
}

function merge(
  arrival: DepartureArrivalData,
  departure: DepartureArrivalData,
): ApiResponse {
  const services = [...arrival.services, ...departure.services];
  const { departureStation, ...rest } = arrival;
  const lastArrivalDateUnix = dayjs(
    arrival.services.at(-1)?.arrivalInfo?.scheduled,
  ).unix();
  const lastDepartureDateUnix = dayjs(
    departure.services.at(-1)?.departureInfo?.scheduled,
  ).unix();

  return {
    ...rest,
    station: departureStation,
    nextDateUnix: Math.min(lastArrivalDateUnix, lastDepartureDateUnix) + 1,
    services,
  };
}
