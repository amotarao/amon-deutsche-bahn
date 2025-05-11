"use client";

import useSWR from "swr";
import { RouteStationCard } from "./_components/RouteStationCard";
import { fetchTrainTimetable } from "./actions";

type Props = {
  id: string;
};

export function PageClient({ id }: Props) {
  const { data, isLoading } = useSWR([id], ([id]) => fetchTrainTimetable(id));

  if (isLoading) {
    return <p className="px-4 py-2 text-sm">Fetching</p>;
  }

  if (!data) {
    return <p className="px-4 py-2 text-sm">No Data</p>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="px-4 py-2">
          <p className="text-sm font-bold">{data.fahrt.zugName}</p>
          <p className="text-xs">{data.fahrt.reisetag}</p>
          <p className="text-xs">{data.fahrt.regulaereVerkehrstage}</p>
          <p className="text-xs">{data.fahrt.irregulaereVerkehrstage}</p>
        </div>
        <div className="flex flex-col">
          {data.fahrt.halte.map((halt) => (
            <RouteStationCard
              key={halt.id}
              className="border-b border-dashed border-gray-300 dark:border-slate-600"
              halt={halt}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 px-4 py-2">
          <div className="text-xs">
            {data.fahrt.priorisierteMeldungen.map(
              ({ prioritaet, text, type }) => (
                <p
                  key={text}
                  className="data-[priority=HOCH]:text-red-500"
                  data-priority={prioritaet}
                  data-type={type}
                >
                  {type && <>[{type}] </>}
                  {text}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
