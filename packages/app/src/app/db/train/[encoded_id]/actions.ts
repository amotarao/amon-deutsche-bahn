"use server";

import type { TrainTimetableResponse } from "../../_types";
import { getCookie } from "../../_lib/cookie";
import { getRoute } from "../../_lib/route";

export async function fetchTrainTimetable(
  journeyId: string,
): Promise<TrainTimetableResponse | null> {
  const cookie = await getCookie();
  if (!cookie) return null;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const route = await getRoute(journeyId, cookie);
  if (!route) return null;

  return {
    route,
  };
}
