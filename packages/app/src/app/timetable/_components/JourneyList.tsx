"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetchTimetable } from "../../../modules/fetch-api/timetable";
import type { TrainType } from "../../../utils/api/timetable/types";
import { JourneyCard } from "./JourneyCard";

type Props = {
  className?: string;
  name: string;
};

export function JourneyList({ className, name }: Props) {
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

  const type = ["arr", "dep", "both"].some(
    (type) => type === searchParams?.get("type"),
  )
    ? searchParams?.get("type")
    : "both";

  const journeyItems = data.data.journeyItems
    .filter((journey) => {
      const trainType = searchParams?.get("trainType");
      if (!trainType) return true;

      const allowedTrainType: TrainType[] = [];
      if (trainType.includes("express"))
        allowedTrainType.push("ice", "ic", "d");
      if (trainType.includes("train")) allowedTrainType.push("nv");
      if (trainType.includes("s-bahn")) allowedTrainType.push("s");
      return allowedTrainType.some((type) => type === journey.trainType);
    })
    .filter((journey) => {
      if (type === "arr") return journey.arrivalTime;
      if (type === "dep") return journey.departureTime;
      return true;
    })
    .filter((journey) => {
      if (searchParams?.get("ignoreNullablePlatform") === "true")
        return journey.platform !== null;
      return true;
    })
    .filter((journey) => {
      if (searchParams?.get("onlyAccurateStation") === "true")
        return journey.accurateStation === null;
      return true;
    });

  return (
    <section className={className}>
      <div className="flex flex-col">
        {journeyItems.map((journey) => (
          <JourneyCard
            key={journey.detailHref}
            className="border-b border-dashed border-gray-300"
            type={
              ["arr", "dep", "both"].some(
                (type) => type === searchParams?.get("type"),
              )
                ? (searchParams?.get("type") as "arr" | "dep" | "both")
                : "both"
            }
            journey={journey}
          />
        ))}
      </div>
    </section>
  );
}
