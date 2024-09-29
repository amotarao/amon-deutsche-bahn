"use client";

import classNames from "classnames";
import Link from "next/link";
import type { Train } from "../_types";

type Props = {
  className?: string;
  train: Train;
};

export function TrainCard({ className, train }: Props) {
  return (
    <div
      className={classNames(
        "flex flex-wrap gap-2 px-4 py-2 text-xs",
        className,
      )}
    >
      <div className="flex w-full gap-2">
        <TimeField type="arrival" info={train.arrival} />
        <TimeField type="departure" info={train.departure} />
        <p className="shrink grow">
          <span>{train.train}</span>
          <br />
          {train.origin && (
            <Link
              className="underline"
              href={`/cfr/station/${encodeURIComponent(train.origin)}`}
            >
              {train.origin}
            </Link>
          )}
          {train.origin && train.destination && <span> -&gt; </span>}
          {train.destination && (
            <Link
              className="underline"
              href={`/cfr/station/${encodeURIComponent(train.destination)}`}
            >
              {train.destination}
            </Link>
          )}
        </p>
        <p className="w-10 shrink-0">
          {train.departure?.platform ?? train.arrival?.platform ?? ""}
        </p>
      </div>
    </div>
  );
}

type TimeFieldProps =
  | {
      type: "arrival";
      info: Train["arrival"];
    }
  | {
      type: "departure";
      info: Train["departure"];
    };

function TimeField({ info }: TimeFieldProps) {
  const delayed = info && info.delay !== null && info.delay > 0;

  return (
    <div className="w-10 shrink-0 text-right">
      {info && (
        <p>
          <span>{info.time}</span>
          <br />
          {info.delay !== null && (
            <span className={classNames(delayed && "text-red-500")}>
              {info.delay === 0
                ? "+0"
                : info.delay > 0
                  ? `+${info.delay}`
                  : info.delay}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
