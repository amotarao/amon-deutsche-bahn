"use server";

import * as cd from "@amon-deutsche-bahn/cd";
import * as db from "@amon-deutsche-bahn/db";

export async function fetchCdStationSearch(
  ...args: Parameters<typeof cd.fetchStationSearch>
): ReturnType<typeof cd.fetchStationSearch> {
  return cd.fetchStationSearch(...args);
}

export async function fetchDbStationSearch(
  ...args: Parameters<typeof db.fetchStationSearch>
): ReturnType<typeof db.fetchStationSearch> {
  return db.fetchStationSearch(...args);
}
