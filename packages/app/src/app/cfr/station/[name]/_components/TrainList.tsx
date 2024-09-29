"use client";

import type { Train } from "../_types";
import { TrainCard } from "./TrainCard";

type Props = {
  trains: Train[];
  date: string;
};

export function TrainList({ trains, date }: Props) {
  return (
    <section>
      <div className="flex flex-col">
        {trains.map((train) => (
          <TrainCard
            key={train.train}
            className="border-b border-dashed border-gray-300"
            train={train}
            date={date}
          />
        ))}
      </div>
    </section>
  );
}
