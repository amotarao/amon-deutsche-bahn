import { fetchTimetable } from '../../modules/fetch-api/timetable';
import { JourneyList } from './JourneyList';
import { StationIdList } from './StationIdList';

type Props = {
  className?: string;
  name: string;
  searchParams: {
    [key: string]: string;
  };
};

export async function Main({ className, name, searchParams }: Props) {
  const response = await fetchTimetable(name, searchParams, { next: { revalidate: 60 * 3 } });

  return (
    <main className={className}>
      {response.data.ids.length > 0 ? (
        <StationIdList ids={response.data.ids} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="px-4 py-1 text-sm font-bold">{response.data.name}</p>
          {/* @ts-expect-error Async Server Component */}
          <JourneyList name={name} searchParams={searchParams} />
        </div>
      )}
    </main>
  );
}
