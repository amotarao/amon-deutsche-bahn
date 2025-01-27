"use client";

import type { TrainService } from "../_types";
import { TrainCard } from "./TrainCard";

type Props = {
  services: TrainService[];
};

export function TrainList({ services }: Props) {
  return (
    <section>
      <div className="flex flex-col">
        {services.map((service) => (
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
