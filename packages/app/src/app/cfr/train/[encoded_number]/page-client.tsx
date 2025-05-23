"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { RouteStationCard } from "./_components/RouteStationCard";
import { fetchApi } from "./_lib/api";

type Props = {
  number: string;
};

export function PageClient({ number }: Props) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR(["cfr", "train", number], ([, , number]) =>
    fetchApi(number, searchParams),
  );

  return (
    <div>
      {isLoading ? (
        <p className="px-4 py-2 text-sm">Fetching</p>
      ) : !data ? (
        <p className="px-4 py-2 text-sm">No Data</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="px-4 py-2">
            <p className="text-sm font-bold">{data.name}</p>
          </div>
          <div className="flex flex-col">
            {data.stations.map((station) => (
              <RouteStationCard
                key={station.name}
                className="border-b border-dashed border-gray-300 dark:border-slate-600"
                station={station}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
