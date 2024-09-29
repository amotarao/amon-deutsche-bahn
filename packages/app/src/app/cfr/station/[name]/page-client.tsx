"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { getRomaniaDate } from "../../_lib/time";
import { TimetableFilter } from "./_components/TimetableFilter";
import { TrainList } from "./_components/TrainList";
import { fetchApi } from "./_lib/api";
import type { PageProps } from "./page";

export function PageClient({ params }: PageProps) {
  const name = decodeURIComponent(params.name);

  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR(["cfr", "station", name], ([, , name]) =>
    fetchApi(name, searchParams),
  );

  const date = searchParams?.get("date") ?? getRomaniaDate();

  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" name={name} />
      {isLoading ? (
        <p className="px-4 py-2 text-sm">Fetching</p>
      ) : !data ? (
        <p className="px-4 py-2 text-sm">No Data</p>
      ) : (
        <main>
          <div className="flex flex-col gap-2">
            <p className="px-4 py-1 text-sm font-bold">{data.name}</p>
            <TrainList trains={data.trains} date={date} />
          </div>
        </main>
      )}
    </div>
  );
}
