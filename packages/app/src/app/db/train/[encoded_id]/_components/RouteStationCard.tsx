import classNames from "classnames";
import Link from "next/link";
import { useMemo } from "react";
import type { Halt } from "../../../_types";
import { formatGermanyDate, formatGermanyTime } from "../../../utils/datetime";

type Props = {
  className?: string;
  halt: Halt;
};

export function RouteStationCard({ className, halt }: Props) {
  const href = useMemo(() => {
    const DUMMY_BASE_URL = "https://example.com";
    const url = new URL(
      `/db/station/${halt.name.replace(/\//g, "")}`,
      DUMMY_BASE_URL,
    );
    const date = halt.ezAnkunftsZeitpunkt || halt.ezAbfahrtsZeitpunkt;
    if (date) {
      url.searchParams.append("date", formatGermanyDate(date));
      url.searchParams.append("time", formatGermanyTime(date));
    }
    return url.href.replace(DUMMY_BASE_URL, "");
  }, [halt]);

  return (
    <div
      className={classNames(
        "flex flex-wrap gap-2 px-4 py-2 text-xs",
        className,
      )}
    >
      <div className="flex w-full gap-2">
        <div className="shrink grow">
          <Link className="underline" href={href} prefetch={false}>
            {halt.name}
          </Link>
          <br />
          {/* {halt.information.noStop && (
            <span className="font-bold text-red-500">No Stop</span>
          )}
          {halt.information.extraStop && (
            <span className="font-bold text-red-500">Extra Stop</span>
          )} */}
        </div>
        <div className="w-12 shrink-0 text-right">
          {halt.ankunftsZeitpunkt && (
            <p
              className={classNames(
                // halt.information.noStop && "font-bold text-red-500 line-through",
              )}
            >
              {formatGermanyTime(halt.ankunftsZeitpunkt)}
            </p>
          )}
          {halt.ezAnkunftsZeitpunkt && (
            <p
              className={classNames(
                // halt.arrivalDelayed && "text-red-500"
              )}
            >
              {halt.ankunftsZeitpunkt !== halt.ezAnkunftsZeitpunkt ? (
                <>&gt;{formatGermanyTime(halt.ezAnkunftsZeitpunkt)}</>
              ) : (
                <>+0</>
              )}
            </p>
          )}
        </div>
        <div className="w-12 shrink-0 text-right">
          {halt.abfahrtsZeitpunkt && (
            <p
              className={classNames(
                // halt.information.noStop && "font-bold text-red-500 line-through",
              )}
            >
              {formatGermanyTime(halt.abfahrtsZeitpunkt)}
            </p>
          )}
          {halt.ezAbfahrtsZeitpunkt && (
            <span
              className={classNames(
                // halt.departureDelayed && "text-red-500",
              )}
            >
              {halt.abfahrtsZeitpunkt !== halt.ezAbfahrtsZeitpunkt ? (
                <>&gt;{formatGermanyTime(halt.ezAbfahrtsZeitpunkt)}</>
              ) : (
                <>+0</>
              )}
            </span>
          )}
        </div>
        <div className="w-10 shrink-0 text-right">
          <p
            className="data-[has-changed-platform=true]:line-through data-[has-changed-platform=true]:font-bold data-[has-changed-platform=true]:text-red-500"
            data-has-changed-platform={!!halt.ezGleis}
          >
            {halt.gleis ?? "?"}
          </p>
          {halt.ezGleis && (
            <p className="text-right text-red-500 font-bold">{halt.ezGleis}</p>
          )}
        </div>
      </div>
      {halt.priorisierteMeldungen.length > 0 && (
        <div className="w-full">
          {halt.priorisierteMeldungen.map(({ prioritaet, text, type }) => (
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
      )}
    </div>
  );
}
