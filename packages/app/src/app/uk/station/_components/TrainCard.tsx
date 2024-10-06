"use client";

import classNames from "classnames";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import type { TrainService } from "../_types";

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  className?: string;
  service: TrainService;
};

export function TrainCard({ className, service }: Props) {
  return (
    <div
      className={classNames(
        "flex flex-wrap gap-2 px-4 py-2 text-xs",
        className,
      )}
    >
      <div className="flex w-full gap-2">
        <TimeField type="arrival" info={service.arrivalInfo} />
        <TimeField type="departure" info={service.departureInfo} />
        <p className="shrink grow">
          <span>
            {getShortenServiceName(service)} ({service.operator.name})
          </span>
          <br />
          {service.arrivalInfo &&
            service.origin &&
            service.origin.map((station) => (
              <Link
                key={station.crs}
                className="underline"
                href={`/uk/station/${station.crs}`}
              >
                {station.locationName}
              </Link>
            ))}
          {service.arrivalInfo &&
            service.origin &&
            service.departureInfo &&
            service.destination && <span> -&gt; </span>}
          {service.departureInfo &&
            service.destination &&
            service.destination.map((station) => (
              <Link
                key={station.crs}
                className="underline"
                href={`/uk/station/${station.crs}`}
              >
                {station.locationName}
              </Link>
            ))}
        </p>
        <p className="w-10 shrink-0">{service.platform}</p>
      </div>
      <StatusField service={service} />
    </div>
  );
}

type TimeFieldProps =
  | {
      type: "arrival";
      info: {
        scheduled: string;
        estimated: string | null;
        actual: string | null;
      } | null;
    }
  | {
      type: "departure";
      info: {
        scheduled: string;
        estimated: string | null;
        actual: string | null;
      } | null;
    };

function TimeField({ info }: TimeFieldProps) {
  return (
    <div className="w-10 shrink-0 text-right">
      {info && (
        <div>
          <p>{getTime(info.scheduled)}</p>
          {info.estimated && <p>{getTime(info.estimated)}</p>}
          {info.actual && <p>{getTime(info.actual)}</p>}
        </div>
      )}
    </div>
  );
}

type StatusFieldProps = {
  service: TrainService;
};

function StatusField({ service }: StatusFieldProps) {
  switch (service.status.status) {
    case "Late":
      return (
        <div>
          {service.status.status}: {service.status.delayReason}
        </div>
      );
    case "Canceled":
      return (
        <div>
          {service.status.status}: {service.status.cancelReason}
        </div>
      );
    default:
      return null;
  }
}

function getTime(date: string) {
  return dayjs(date).tz("Europe/London").format("HH:mm");
}

function getShortenServiceName(service: TrainService) {
  const originalName = service.serviceType.category;
  switch (originalName) {
    case "PassengerTrain":
      return "Local";
    case "ExpressPassengerTrain":
      return "Exp";
    default:
      return originalName;
  }
}
