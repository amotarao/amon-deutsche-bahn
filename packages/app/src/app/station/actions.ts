"use server";

import * as cd from "@amon-deutsche-bahn/cd";

export async function fetchStationSearch(
  ...args: Parameters<typeof cd.fetchStationSearch>
): ReturnType<typeof cd.fetchStationSearch> {
  return cd.fetchStationSearch(...args);
}
