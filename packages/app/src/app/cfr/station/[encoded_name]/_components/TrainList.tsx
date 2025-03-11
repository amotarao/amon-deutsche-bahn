"use client";

import type { Train } from "../_types";
import { TrainCard } from "./TrainCard";

type Props = {
  trains: Train[];
};

export function TrainList({ trains }: Props) {
  return (
    <section>
      <div className="flex flex-col">
        {trains.map((train) => (
          <TrainCard
            key={train.train}
            className="border-b border-dashed border-gray-300 dark:border-slate-600"
            train={train}
          />
        ))}
      </div>
    </section>
  );
}
