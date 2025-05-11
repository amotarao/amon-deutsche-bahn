"use server";

import { getRoute } from "../../_lib/route";
import type { TrainTimetableResponse } from "../../_types";

export async function fetchTrainTimetable(
  journeyId: string,
): Promise<TrainTimetableResponse | null> {
  const fahrt = await getRoute(journeyId);
  if (!fahrt) return null;

  return {
    fahrt,
  };
}
