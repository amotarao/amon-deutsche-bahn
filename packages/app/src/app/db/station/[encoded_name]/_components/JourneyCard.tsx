import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { getGermanyTime } from "../../../../../modules/fetch-api/timetable";
import type { Journey } from "../types";

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
          {journey.ankunft && <span>{journey.ankunft.terminus}</span>}
          {journey.ankunft && journey.abfahrt && <span> -&gt; </span>}
          {journey.abfahrt && <span>{journey.abfahrt.terminus}</span>}
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
    (type === "dep" ? journey.abfahrt : journey.ankunft) || {};

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
        {getGermanyTime(zeit)}
      </p>
      {ezZeit && (
        <p className="data-[delay=true]:text-red-500" data-delay={diff >= 5}>
          {zeit !== ezZeit ? <>&gt;{getGermanyTime(ezZeit)}</> : <>+0</>}
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
    (journey.abfahrt || journey.ankunft)?.verkehrmittel || {};
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
  const { gleis, ezGleis } = journey.ankunft || journey.abfahrt || {};

  return (
    <div className="w-10 shrink-0">
      <p
        className="text-right data-[has-changed-platform=true]:font-bold data-[has-changed-platform=true]:text-red-500"
        data-has-changed-platform={!!ezGleis}
      >
        {gleis}
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
    ...(journey.ankunft?.meldungen ?? []),
    ...(journey.abfahrt?.meldungen ?? []),
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
