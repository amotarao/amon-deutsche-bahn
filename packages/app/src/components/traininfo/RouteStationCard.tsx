import type { Route } from 'next';
import Link from 'next/link';
import { Station } from '../../utils/api/traininfo/types';

export type RouteStationCardProps = {
  className?: string;
  station: Station;
};

export const RouteStationCard: React.FC<RouteStationCardProps> = ({ className, station }) => {
  return (
    <div className={`flex flex-wrap gap-2 px-4 py-2 text-xs ${className}`}>
      <div className="flex w-full gap-2">
        <div className="shrink grow">
          <Link
            className={
              station.information.noStop || station.information.extraStop
                ? 'font-bold text-red-500 underline'
                : 'underline'
            }
            href={station.detailHref as Route}
          >
            {station.name}
          </Link>
          <br />
          {station.information.noStop && <span className="font-bold text-red-500">No Stop</span>}
          {station.information.extraStop && <span className="font-bold text-red-500">Extra Stop</span>}
        </div>
        <p className="w-12 shrink-0 text-right">
          <span className={station.information.noStop ? 'font-bold text-red-500 line-through' : ''}>
            {station.arrivalTime}
          </span>
          <br />
          {station.arrivalActualTime && station.arrivalTime !== station.arrivalActualTime && (
            <span className={station.arrivalDelayed ? 'text-red-500' : ''}>&gt;{station.arrivalActualTime}</span>
          )}
        </p>
        <p className="w-12 shrink-0 text-right">
          <span className={station.information.noStop ? 'font-bold text-red-500 line-through' : ''}>
            {station.departureTime}
          </span>
          <br />
          {station.departureActualTime && station.departureTime !== station.departureActualTime && (
            <span className={station.departureDelayed ? 'text-red-500' : ''}>&gt;{station.departureActualTime}</span>
          )}
        </p>
        <p className="w-10 shrink-0 text-right">
          <span className={station.information.changedPlatform ? 'font-bold text-red-500' : ''}>
            {station.platform}
          </span>
        </p>
      </div>
      {station.information.message.length > 0 && (
        <div className="w-full">
          {station.information.message.map((message, i) => {
            return <p key={i}>* {message}</p>;
          })}
        </div>
      )}
    </div>
  );
};
