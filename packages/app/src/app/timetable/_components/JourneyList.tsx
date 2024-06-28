import { fetchTimetable } from "../../../modules/fetch-api/timetable";
import type { TrainType } from "../../../utils/api/timetable/types";
import { JourneyCard } from "./JourneyCard";

type Props = {
  className?: string;
  name: string;
  searchParams: {
    [key: string]: string;
  };
};

export async function JourneyList({ className, name, searchParams }: Props) {
  const response = await fetchTimetable(name, searchParams, {
    next: { revalidate: 60 * 3 },
  });

  const type = ["arr", "dep", "both"].some((type) => type === searchParams.type)
    ? (searchParams.type as "arr" | "dep" | "both")
    : "both";

  const journeyItems = response.data.journeyItems
    .filter((journey) => {
      const trainType = searchParams.trainType;
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
    .filter((journery) => {
      if (searchParams.ignoreNullablePlatform === "true")
        return journery.platform !== null;
      return true;
    })
    .filter((journery) => {
      if (searchParams.onlyAccurateStation === "true")
        return journery.accurateStation === null;
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
              ["arr", "dep", "both"].some((type) => type === searchParams.type)
                ? (searchParams.type as "arr" | "dep" | "both")
                : "both"
            }
            journey={journey}
          />
        ))}
      </div>
    </section>
  );
}
