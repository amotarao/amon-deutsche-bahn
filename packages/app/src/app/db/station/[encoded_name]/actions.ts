"use server";

import type {
  Arrival,
  Departure,
  Journey,
  StationTimetableResponse,
} from "../../_types";
import { getArrivals } from "../../_lib/arrivals";
import { getDepartures } from "../../_lib/departures";
import { searchPlaces } from "../../_lib/places";

export async function fetchStationTimetable(
  name: string,
  searchParamsString: string | undefined,
): Promise<StationTimetableResponse | null> {
  const places = await searchPlaces(name);
  const place = places[0];
  if (!place) return null;

  const searchParams = new URLSearchParams(searchParamsString);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [departures, arrivals] = await Promise.all([
    getDepartures({ date, time, ortId: place.id, ortExtId: place.extId }),
    getArrivals({ date, time, ortId: place.id, ortExtId: place.extId }),
  ]);

  return {
    ort: place,
    journeys: mergeJourney(departures.entries, arrivals.entries),
  };
}

function mergeJourney(
  departures: Departure[] | undefined,
  arrivals: Arrival[] | undefined,
) {
  const journeys: Journey[] = [];

  departures?.forEach((departure) => {
    journeys.push({
      journeyId: departure.journeyId,
      departure,
      arrival: null,
    });
  });

  arrivals?.forEach((arrival) => {
    const journey = journeys.find(
      (journey) => journey.journeyId === arrival.journeyId,
    );
    if (journey) {
      journey.arrival = arrival;
      return;
    }
    journeys.push({
      journeyId: arrival.journeyId,
      departure: null,
      arrival,
    });
  });

  return journeys.toSorted((a, z) => {
    const aZeit =
      a.arrival?.ezZeit ||
      a.arrival?.zeit ||
      a.departure?.ezZeit ||
      a.departure?.zeit ||
      "";
    const zZeit =
      z.arrival?.ezZeit ||
      z.arrival?.zeit ||
      z.departure?.ezZeit ||
      z.departure?.zeit ||
      "";

    return aZeit.localeCompare(zZeit);
  });
}
