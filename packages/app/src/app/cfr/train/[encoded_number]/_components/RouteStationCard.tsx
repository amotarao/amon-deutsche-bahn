import classNames from "classnames";
import Link from "next/link";

import type { Station } from "../_types";

import { getRomaniaDate } from "../../../_lib/time";

type Props = {
  className?: string;
  station: Station;
};

export function RouteStationCard({ className, station }: Props) {
  const searchParams = new URLSearchParams();
  searchParams.set(
    "date",
    station.arrival?.date ?? station.departure?.date ?? getRomaniaDate(),
  );

  return (
    <div
      className={classNames(
        "flex flex-wrap gap-2 px-4 py-2 text-xs",
        className,
      )}
    >
      <div className="flex w-full gap-2">
        <div className="shrink grow">
          <Link
            className="underline"
            href={`/cfr/station/${station.name}?${searchParams.toString()}`}
            prefetch={false}
          >
            {station.name}
          </Link>
        </div>
        <TimeField type="arrival" info={station.arrival} />
        <TimeField type="departure" info={station.departure} />
        <p className="w-10 shrink-0 text-right">
          <span>
            {station.arrival?.platform ?? station.departure?.platform ?? ""}
          </span>
        </p>
      </div>
    </div>
  );
}

type TimeFieldProps =
  | {
      type: "arrival";
      info: Station["arrival"];
    }
  | {
      type: "departure";
      info: Station["departure"];
    };

function TimeField({ info }: TimeFieldProps) {
  const delayed = info && info.delay !== null && info.delay > 0;

  return (
    <div className="w-12 shrink-0 text-right">
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
