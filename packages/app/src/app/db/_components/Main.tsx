"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetchTimetable } from "../../../modules/fetch-api/timetable";
import { JourneyList } from "./JourneyList";
import { StationIdList } from "./StationIdList";

type Props = {
  className?: string;
  name: string;
};

export function Main({ className, name }: Props) {
  const searchParams = useSearchParams();

  const { data, isLoading } = useSWR(
    [name, searchParams?.toString()],
    ([name, searchParamsString]) => fetchTimetable(name, searchParamsString),
  );

  if (isLoading) {
    return <p className="px-4 py-2 text-sm">Fetching</p>;
  }

  if (!data) {
    return <p className="px-4 py-2 text-sm">No Data</p>;
  }

  return (
    <main className={className}>
      {data.data.ids.length > 0 ? (
        <StationIdList ids={data.data.ids} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="px-4 py-1 text-sm font-bold">{data.data.name}</p>
          <JourneyList name={name} />
        </div>
      )}
    </main>
  );
}
