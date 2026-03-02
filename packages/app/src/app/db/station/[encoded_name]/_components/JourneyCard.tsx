import classNames from "classnames";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";

import type { Journey } from "../../../_types";

import { formatGermanyTime } from "../../../_utils/datetime";

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Europe/Berlin";

type Props = {
  className?: string;
  type: "arr" | "dep" | "both";
  journey: Journey;
  stationName: string;
};

export function JourneyCard({ className, type = "both", journey, stationName }: Props) {
  return (
    <div className={classNames("flex flex-wrap gap-2 px-4 py-2 text-xs", className)}>
      <div className="flex w-full gap-2">
        {type === "dep" ? null : <TimeField type="arr" journey={journey} />}
        {type === "arr" ? null : <TimeField type="dep" journey={journey} />}
        <p className="shrink grow">
          <TrainField journey={journey} />
          <br />
          {journey.arrival && (
            <span>{journey.arrival.terminus || journey.arrival.ueber.at(-1)}</span>
          )}
          {journey.arrival && journey.departure && <span> -&gt; </span>}
          {journey.departure && (
            <span>{journey.departure.terminus || journey.departure.ueber.at(-1)}</span>
          )}
        </p>
        <PlatformField journey={journey} />
        <CalendarField journey={journey} stationName={stationName} />
      </div>
      <InformationField className="w-full" journey={journey} />
    </div>
  );
}

type TimeFieldProps = {
  type: "arr" | "dep";
  journey: Journey;
};

function TimeField({ type, journey }: TimeFieldProps) {
  const { zeit, ezZeit, meldungen } = (type === "dep" ? journey.departure : journey.arrival) || {};

  if (!zeit) return <div className="w-10 shrink-0" />;

  const diff = dayjs(ezZeit || zeit).diff(dayjs(zeit), "minute");

  return (
    <div className="w-10 shrink-0 text-right">
      <p
        className="data-[canceled=true]:font-bold data-[canceled=true]:text-red-500 data-[canceled=true]:line-through"
        data-canceled={meldungen?.some((meldung) => meldung.type === "HALT_AUSFALL")}
      >
        {formatGermanyTime(zeit)}
      </p>
      {ezZeit && (
        <p className="data-[delay=true]:text-red-500" data-delay={diff >= 5}>
          {zeit !== ezZeit ? <>&gt;{formatGermanyTime(ezZeit)}</> : <>+0</>}
        </p>
      )}
    </div>
  );
}

type TrainFieldProps = {
  journey: Journey;
};

function TrainField({ journey }: TrainFieldProps) {
  const { mittelText, name } = (journey.departure || journey.arrival)?.verkehrmittel || {};
  const trainName = mittelText === name ? name : `${mittelText} (${name})`;

  return (
    <Link
      className="underline"
      href={`/db/train/${encodeURIComponent(journey.journeyId)}`}
      prefetch={false}
    >
      {trainName}
    </Link>
  );
}

type PlatformFieldProps = {
  journey: Journey;
};

function PlatformField({ journey }: PlatformFieldProps) {
  const { gleis, ezGleis } = journey.arrival || journey.departure || {};

  return (
    <div className="w-10 shrink-0 text-right">
      <p
        className="data-[has-changed-platform=true]:font-bold data-[has-changed-platform=true]:text-red-500 data-[has-changed-platform=true]:line-through"
        data-has-changed-platform={!!ezGleis}
      >
        {gleis ?? "?"}
      </p>
      {ezGleis && <p className="text-right font-bold text-red-500">{ezGleis}</p>}
    </div>
  );
}

type CalendarFieldProps = {
  journey: Journey;
  stationName: string;
};

function CalendarField({ journey, stationName }: CalendarFieldProps) {
  const { mittelText, name } = (journey.departure || journey.arrival)?.verkehrmittel || {};
  const trainName = mittelText === name ? name : `${mittelText} (${name})`;

  const arrZeit = journey.arrival?.ezZeit || journey.arrival?.zeit;
  const depZeit = journey.departure?.ezZeit || journey.departure?.zeit;

  const arrTime = arrZeit ? dayjs.tz(arrZeit, tz) : null;
  const depTime = depZeit ? dayjs.tz(depZeit, tz) : null;
  const refStart = arrTime ?? depTime;
  const refEnd = depTime ?? arrTime;

  if (!refStart || !refEnd) return null;

  const eventStart = refStart.subtract(10, "minute");
  const eventEnd = refEnd.add(5, "minute");

  const timeStr = [arrTime?.format("HH:mm"), depTime?.format("HH:mm")].filter(Boolean).join(" - ");

  const from = journey.arrival?.terminus || journey.arrival?.ueber.at(-1);
  const to = journey.departure?.terminus || journey.departure?.ueber.at(-1);
  const vonNach = [from && `von ${from}`, to && `nach ${to}`].filter(Boolean).join(" ");

  const title = `🎤 ${timeStr}: ${trainName} ${vonNach}`.trim();

  const startStr = `${eventStart.utc().format("YYYYMMDDTHHmmss")}Z`;
  const endStr = `${eventEnd.utc().format("YYYYMMDDTHHmmss")}Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startStr}/${endStr}`,
    location: stationName,
  });

  const url = `https://www.google.com/calendar/render?${params.toString()}`;

  return (
    <a
      className="shrink-0 text-blue-500 hover:text-blue-700"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Add to Google Calendar"
    >
      📅
    </a>
  );
}

type InformationFieldProps = {
  className?: string;
  journey: Journey;
};

function InformationField({ className, journey }: InformationFieldProps) {
  const meldungen = [
    ...(journey.arrival?.meldungen ?? []),
    ...(journey.departure?.meldungen ?? []),
  ].filter((meldung, index, self) => self.findIndex((m) => m.text === meldung.text) === index);

  if (meldungen.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {meldungen.map(({ prioritaet, text, type }) => (
        <p
          key={text}
          className="line-clamp-1 data-[priority=HOCH]:text-red-500"
          data-priority={prioritaet}
          data-type={type}
        >
          {type && <>[{type}] </>}
          {text}
        </p>
      ))}
    </div>
  );
}
