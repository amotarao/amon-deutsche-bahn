"use server";

import { getFahrt } from "../../_lib/fahrt";
import type { TrainTimetableResponse } from "../../_types";

export async function fetchTrainTimetable(
  journeyId: string,
): Promise<TrainTimetableResponse | null> {
  const fahrt = await getFahrt(journeyId);
  if (!fahrt) return null;

  return {
    fahrt,
  };
}
