"use server";

import { getRoute } from "../../_lib/route";
import type { TrainTimetableResponse } from "../../_types";

export async function fetchTrainTimetable(
  journeyId: string,
): Promise<TrainTimetableResponse | null> {
  const route = await getRoute(journeyId);
  if (!route) return null;

  return {
    route,
  };
}
