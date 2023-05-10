import Link from 'next/link';
import { Station } from '../../types/station';

export type StationCardProps = {
  className?: string;
  station: Station;
};

export const StationCard: React.FC<StationCardProps> = ({ className, station }) => {
  const youtubeUrl = new URL('https://www.youtube.com/results');
  youtubeUrl.searchParams.set('search_query', station.name + ` bahnhof`);
  youtubeUrl.searchParams.set('sp', 'CAISAhABQgIIAQ%3D%3D');

  return (
    <div className={`${className} flex flex-col gap-2 rounded border p-2`}>
      <p>{station.name}</p>
      <div className="flex gap-2">
        <Link
          className="block rounded border border-slate-300 px-2 py-0.5"
          href={`/timetable/stations/${encodeURIComponent(station.name)}?type=dep`}
          prefetch={false}
        >
          Departure
        </Link>
        <Link
          className="block rounded border border-slate-300 px-2 py-0.5"
          href={`/timetable/stations/${encodeURIComponent(station.name)}?type=arr`}
          prefetch={false}
        >
          Arrival
        </Link>
        <a
          className="block rounded border border-slate-300 px-2 py-0.5"
          href={youtubeUrl.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube
        </a>
      </div>
    </div>
  );
};
