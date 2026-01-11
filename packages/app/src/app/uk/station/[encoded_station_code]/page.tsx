import type { Metadata } from "next";

import { PageClient } from "./page-client";

export default async function Page({
  params,
}: PageProps<"/uk/station/[encoded_station_code]">) {
  const { encoded_station_code } = await params;
  const stationCode = decodeURIComponent(encoded_station_code);
  return <PageClient stationCode={stationCode} />;
}

export async function generateMetadata({
  params,
}: PageProps<"/uk/station/[encoded_station_code]">): Promise<Metadata> {
  const { encoded_station_code } = await params;
  const stationCode = decodeURIComponent(encoded_station_code);
  return {
    title: `Timetable at ${stationCode}`,
  };
}
