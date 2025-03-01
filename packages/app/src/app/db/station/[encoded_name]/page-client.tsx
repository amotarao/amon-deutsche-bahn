"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import type { StationTimetableResponse } from "../../_types";
import { JourneyList } from "./_components/JourneyList";
import { TimetableFilter } from "./_components/TimetableFilter";
import { fetchStationTimetable } from "./actions";

type Props = {
  name: string | undefined;
};

export function PageClient({ name }: Props) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR(
    name ? [name, searchParams] : null,
    ([name, searchParams]) =>
      fetchStationTimetable(name, searchParams?.toString()),
  );

  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" defaultName={name} />
      <Main data={data} isLoading={isLoading} />
    </div>
  );
}

type MainProps = {
  className?: string;
  data: StationTimetableResponse | null | undefined;
  isLoading: boolean;
};

function Main({ className, data, isLoading }: MainProps) {
  if (isLoading) {
    return <p className="px-4 py-2 text-sm">Fetching</p>;
  }

  if (!data) {
    return <p className="px-4 py-2 text-sm">No Data</p>;
  }

  return (
    <main className={className}>
      <div className="flex flex-col gap-2">
        <p className="px-4 py-1 text-sm font-bold">{data.ort.name}</p>
        <JourneyList journeys={data.journeys} />
      </div>
    </main>
  );
}
