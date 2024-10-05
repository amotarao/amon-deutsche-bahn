"use client";

import type { DepartureArrivalData } from "../_types";
import { TrainCard } from "./TrainCard";

type Props = {
  data: DepartureArrivalData;
};

export function TrainList({ data }: Props) {
  return (
    <section>
      <div className="flex flex-col">
        {data.services.map((service) => (
          <TrainCard
            key={service.rid}
            className="border-b border-dashed border-gray-300"
            service={service}
          />
        ))}
      </div>
    </section>
  );
}
