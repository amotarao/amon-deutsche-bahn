"use client";

import { useSearchParams } from "next/navigation";
import type { Journey, ProduktGattung } from "../types";
import { JourneyCard } from "./JourneyCard";

type Props = {
  className?: string;
  journeys: Journey[];
};

export function JourneyList({ className, journeys }: Props) {
  const searchParams = useSearchParams();

  const type = ["arr", "dep", "both"].some(
    (type) => type === searchParams?.get("type"),
  )
    ? searchParams?.get("type")
    : "both";

  const journeyItems = journeys
    .filter((journey) => {
      const trainType = searchParams?.getAll("trainType");
      if (!trainType || trainType.length === 0) return true;

      const allowedTrainType: ProduktGattung[] = [];
      if (trainType.includes("express"))
        allowedTrainType.push("ICE", "EC_IC", "IR");
      if (trainType.includes("train")) allowedTrainType.push("REGIONAL");
      if (trainType.includes("s-bahn")) allowedTrainType.push("SBAHN");
      return allowedTrainType.some(
        (type) =>
          type === journey.ankunft?.verkehrmittel.produktGattung ||
          type === journey.abfahrt?.verkehrmittel.produktGattung,
      );
    })
    .filter((journey) => {
      if (type === "arr") return journey.ankunft !== null;
      if (type === "dep") return journey.abfahrt !== null;
      return true;
    });

  return (
    <section className={className}>
      <div className="flex flex-col">
        {journeyItems.map((journey) => (
          // <pre key={journey.journeyId}>{JSON.stringify(journey, null, 2)}</pre>
          <JourneyCard
            key={journey.journeyId}
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
