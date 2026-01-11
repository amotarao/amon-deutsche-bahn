"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { TimetableFilter } from "./_components/TimetableFilter";
import { TrainList } from "./_components/TrainList";
import { fetchApi } from "./_lib/api";

type Props = {
  name: string;
};

export function PageClient({ name }: Props) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR(["cfr", "station", name], ([, , name]) =>
    fetchApi(name, searchParams),
  );

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
            <TrainList trains={data.trains} />
          </div>
        </main>
      )}
    </div>
  );
}
