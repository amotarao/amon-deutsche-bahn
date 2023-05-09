import { use } from 'react';
import { fetchTimetable } from '../../modules/fetch-api/timetable';
import { JourneyCard } from './JourneyCard';
import { StationIdList } from './StationIdList';

export type MainProps = {
  className?: string;
  name: string;
  searchParams: {
    [key: string]: string;
  };
};

export const Main: React.FC<MainProps> = ({ className, name, searchParams }) => {
  const response = use(fetchTimetable(name, searchParams, { next: { revalidate: 60 * 3 } }));

  return (
    <main className={className}>
      {response.data.ids.length > 0 ? (
        <StationIdList ids={response.data.ids} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="px-4 py-1 text-sm font-bold">{response.data.name}</p>
          <div className="flex flex-col">
            {response.data.journeys.map((journey) => (
              <JourneyCard
                className="border-b border-dashed border-gray-300"
                journey={journey}
                key={journey.detailHref}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
