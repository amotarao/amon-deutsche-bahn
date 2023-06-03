import { fetchTimetable } from '../../modules/fetch-api/timetable';
import { JourneyCard } from './JourneyCard';

type Props = {
  className?: string;
  name: string;
  searchParams: {
    [key: string]: string;
  };
};

export async function JourneyList({ className, name, searchParams }: Props) {
  const response = await fetchTimetable(name, searchParams, { next: { revalidate: 60 * 3 } });

  return (
    <section className={className}>
      <div className="flex flex-col">
        {response.data.journeys.map((journey) => (
          <JourneyCard key={journey.detailHref} className="border-b border-dashed border-gray-300" journey={journey} />
        ))}
      </div>
    </section>
  );
}
