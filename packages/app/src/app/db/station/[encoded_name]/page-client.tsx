"use client";

import { useSearchParams } from "next/navigation";
import useSWR, { type SWRResponse } from "swr";
import { JourneyList } from "./_components/JourneyList";
import { TimetableFilter } from "./_components/TimetableFilter";
import { fetchTimetable } from "./actions";
import type { Response } from "./types";

type Props = {
  name: string;
};

export default function PageClient({ name }: Props) {
  const searchParams = useSearchParams();
  const swr = useSWR([name, searchParams], ([name, searchParams]) =>
    fetchTimetable(name, searchParams?.toString()),
  );

  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" defaultName={name} />
      <Main swr={swr} />
    </div>
  );
}

type MainProps = {
  className?: string;
  swr: SWRResponse<Response | null>;
};

function Main({ className, swr: { isLoading, data } }: MainProps) {
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
