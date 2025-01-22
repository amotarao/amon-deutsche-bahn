"use server";

import { getAbfahrten } from "./_lib/abfahrten";
import { getAnkuenfte } from "./_lib/ankuenfte";
import { searchOrte } from "./_lib/orte";
import type { Abfahrt, Ankunft, Journey, Response } from "./types";

export async function fetchTimetable(
  name: string,
  searchParamsString: string | undefined,
): Promise<Response | null> {
  const orte = await searchOrte(name);
  const ort = orte[0];
  if (!ort) return null;

  const searchParams = new URLSearchParams(searchParamsString);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [abfahrten, ankuenfte] = await Promise.all([
    getAbfahrten({ date, time, ortId: ort.id, ortExtId: ort.extId }),
    getAnkuenfte({ date, time, ortId: ort.id, ortExtId: ort.extId }),
  ]);

  return {
    ort,
    journeys: mergeJourney(abfahrten.entries, ankuenfte.entries),
  };
}

function mergeJourney(abfahrten: Abfahrt[], ankuenfte: Ankunft[]) {
  const journeys: Journey[] = [];

  abfahrten.forEach((abfahrt) => {
    journeys.push({
      journeyId: abfahrt.journeyId,
      abfahrt,
      ankunft: null,
    });
  });

  ankuenfte.forEach((ankunft) => {
    const journey = journeys.find(
      (journey) => journey.journeyId === ankunft.journeyId,
    );
    if (journey) {
      journey.ankunft = ankunft;
      return;
    }
    journeys.push({
      journeyId: ankunft.journeyId,
      abfahrt: null,
      ankunft,
    });
  });

  return journeys.toSorted((a, z) => {
    const aZeit =
      a.ankunft?.ezZeit ||
      a.ankunft?.zeit ||
      a.abfahrt?.ezZeit ||
      a.abfahrt?.zeit ||
      "";
    const zZeit =
      z.ankunft?.ezZeit ||
      z.ankunft?.zeit ||
      z.abfahrt?.ezZeit ||
      z.abfahrt?.zeit ||
      "";

    return aZeit.localeCompare(zZeit);
  });
}
