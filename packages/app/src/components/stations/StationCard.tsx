import Link from 'next/link';
import { Station } from '../../types/station';

export type StationCardProps = {
  className?: string;
  station: Station;
  onClickCenter?: () => void;
};

export const StationCard: React.FC<StationCardProps> = ({ className, station, onClickCenter }) => {
  return (
    <div className={`${className} flex flex-col gap-2 rounded border p-2`}>
      <p>{station.name}</p>
      <div className="flex gap-2">
        <button
          className="rounded border border-slate-300 px-2 py-0.5"
          onClick={() => {
            onClickCenter && onClickCenter();
          }}
        >
          Center
        </button>
        <Link href={`/timetable/stations/${station.name}?type=dep`}>
          <a className="block rounded border border-slate-300 px-2 py-0.5">Departure</a>
        </Link>
        <Link href={`/timetable/stations/${station.name}?type=arr`}>
          <a className="block rounded border border-slate-300 px-2 py-0.5">Arrival</a>
        </Link>
      </div>
    </div>
  );
};
