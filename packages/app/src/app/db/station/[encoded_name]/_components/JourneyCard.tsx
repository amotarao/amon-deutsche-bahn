import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import type { Journey } from "../../../_types";
import { formatGermanyTime } from "../../../_utils/datetime";

type Props = {
  className?: string;
  type: "arr" | "dep" | "both";
  journey: Journey;
};

export function JourneyCard({ className, type = "both", journey }: Props) {
  return (
    <div
      className={classNames(
        "flex flex-wrap gap-2 px-4 py-2 text-xs",
        className,
      )}
    >
      <div className="flex w-full gap-2">
        {type === "dep" ? null : <TimeField type="arr" journey={journey} />}
        {type === "arr" ? null : <TimeField type="dep" journey={journey} />}
        <p className="shrink grow">
          <TrainField journey={journey} />
          <br />
          {journey.arrival && (
            <span>
              {journey.arrival.terminus || journey.arrival.ueber.at(-1)}
            </span>
          )}
          {journey.arrival && journey.departure && <span> -&gt; </span>}
          {journey.departure && (
            <span>
              {journey.departure.terminus || journey.departure.ueber.at(-1)}
            </span>
          )}
        </p>
        <PlatformField journey={journey} />
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
  const { zeit, ezZeit, meldungen } =
    (type === "dep" ? journey.departure : journey.arrival) || {};

  if (!zeit) return <div className="w-10 shrink-0" />;

  const diff = dayjs(ezZeit || zeit).diff(dayjs(zeit), "minute");

  return (
    <div className="w-10 shrink-0 text-right">
      <p
        className="data-[canceled=true]:font-bold data-[canceled=true]:text-red-500 data-[canceled=true]:line-through"
        data-canceled={meldungen?.some(
          (meldung) => meldung.type === "HALT_AUSFALL",
        )}
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
  const { mittelText, name } =
    (journey.departure || journey.arrival)?.verkehrmittel || {};
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
        className="data-[has-changed-platform=true]:line-through data-[has-changed-platform=true]:font-bold data-[has-changed-platform=true]:text-red-500"
        data-has-changed-platform={!!ezGleis}
      >
        {gleis ?? "?"}
      </p>
      {ezGleis && (
        <p className="text-right text-red-500 font-bold">{ezGleis}</p>
      )}
    </div>
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
  ].filter(
    (meldung, index, self) =>
      self.findIndex((m) => m.text === meldung.text) === index,
  );

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
