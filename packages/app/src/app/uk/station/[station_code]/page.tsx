import type { Metadata } from "next";
import { PageClient } from "./page-client";

export type PageContext = {
  params: {
    station_code: string;
  };
};

export default function Page(context: PageContext) {
  return <PageClient {...context} />;
}

export const generateMetadata = async ({
  params,
}: PageContext): Promise<Metadata> => {
  const stationCode = decodeURIComponent(params.station_code);
  return {
    title: `Timetable at ${stationCode}`,
  };
};
