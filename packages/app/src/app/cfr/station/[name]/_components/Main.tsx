"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetchTimetable } from "../_lib/timetable";
import { TrainList } from "./TrainList";

type Props = {
  className?: string;
  name: string;
};

export function Main({ className, name }: Props) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR(["cfr", "station", name], ([, , name]) =>
    fetchTimetable(name, searchParams),
  );

  if (isLoading) {
    return <p className="px-4 py-2 text-sm">Fetching</p>;
  }

  if (!data) {
    return <p className="px-4 py-2 text-sm">No Data</p>;
  }

  return (
    <main className={className}>
      <div className="flex flex-col gap-2">
        <p className="px-4 py-1 text-sm font-bold">{data.name}</p>
        <TrainList trains={data.trains} />
      </div>
    </main>
  );
}
