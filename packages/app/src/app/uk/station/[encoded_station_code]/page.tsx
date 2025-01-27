import type { Metadata } from "next";
import { PageClient } from "./page-client";

type Props = {
  params: Promise<{
    encoded_station_code: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { encoded_station_code } = await params;
  const stationCode = decodeURIComponent(encoded_station_code);
  return <PageClient stationCode={stationCode} />;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { encoded_station_code } = await params;
  const stationCode = decodeURIComponent(encoded_station_code);
  return {
    title: `Timetable at ${stationCode}`,
  };
};
