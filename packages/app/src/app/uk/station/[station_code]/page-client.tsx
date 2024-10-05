"use client";

import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { TrainList } from "../_components/TrainList";
import { fetchApi } from "../_lib/api";
import type { PageContext } from "./page";

export function PageClient({ params }: PageContext) {
  const stationCode = decodeURIComponent(params.station_code);
  const [dateUnix, setDateUnix] = useState(dayjs().unix());

  const { data, isLoading } = useSWR(
    [fetchApi, { stationCode, dateUnix }],
    ([fetchApi, args]) => fetchApi(args),
  );

  return (
    <div className="grid grid-cols-1 gap-2">
      <button
        className="px-4 py-2 text-sm bg-green-200 w-full text-center"
        type="button"
        onClick={() => {
          setDateUnix(dayjs().unix());
        }}
      >
        Now
      </button>
      {/* <TimetableFilter className="sticky top-0 mb-4" name={name} /> */}
      {isLoading ? (
        <p className="px-4 py-2 text-sm">Fetching</p>
      ) : !data ? (
        <p className="px-4 py-2 text-sm">No Data</p>
      ) : (
        <main>
          <div className="flex flex-col gap-2">
            <p className="px-4 py-1 text-sm font-bold">
              {data.departure.departureStation.locationName} (
              {data.departure.departureStation.crs})
            </p>
            <TrainList data={data.departure} />
          </div>
        </main>
      )}
    </div>
  );
}
