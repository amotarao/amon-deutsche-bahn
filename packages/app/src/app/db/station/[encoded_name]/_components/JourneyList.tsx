"use client";

import { useSearchParams } from "next/navigation";

import type { Journey, ProduktGattung } from "../../../_types";

import { JourneyCard } from "./JourneyCard";

type Props = {
  className?: string;
  journeys: Journey[];
};

export function JourneyList({ className, journeys }: Props) {
  const searchParams = useSearchParams();

  const typeParam = searchParams?.get("type");
  const type = isType(typeParam) ? typeParam : "both";

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
          type === journey.arrival?.verkehrmittel.produktGattung ||
          type === journey.departure?.verkehrmittel.produktGattung,
      );
    })
    .filter((journey) => {
      if (searchParams?.get("ignoreBus") === "true") {
        const isBus =
          journey.departure?.verkehrmittel.name.startsWith("Bus ") ||
          journey.arrival?.verkehrmittel.name.startsWith("Bus ");
        return !isBus;
      }
      return true;
    })
    .filter((journey) => {
      if (type === "arr") return journey.arrival !== null;
      if (type === "dep") return journey.departure !== null;
      return true;
    });

  return (
    <section className={className}>
      <div className="flex flex-col">
        {journeyItems.map((journey) => (
          // <pre key={journey.journeyId}>{JSON.stringify(journey, null, 2)}</pre>
          <JourneyCard
            key={journey.journeyId}
            className="border-b border-dashed border-gray-300 dark:border-slate-600"
            type={type}
            journey={journey}
          />
        ))}
      </div>
    </section>
  );
}

function isType(
  input: string | null | undefined,
): input is "arr" | "dep" | "both" {
  return ["arr", "dep", "both"].some((type) => type === input);
}
