import { Metadata } from 'next';
import { JourneyCard } from '../../../../components/timetable/JourneyCard';
import { StationIdList } from '../../../../components/timetable/StationIdList';
import { TimetableFilter } from '../../../../components/timetable/TimetableFilter';
import { fetchTimetable } from '../../../../modules/fetch-api/timetable';
import { TimetableResponse, TimetableWithArrivalDepartureResponse } from '../../../../utils/api/timetable/types';

type PageProps = {
  params: {
    name: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

type Data = {
  data: TimetableResponse | TimetableWithArrivalDepartureResponse | null;
  query: TimetableRequestQuery;
};

const getDefaultDate = (): string => {
  const date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  return date.toISOString().slice(0, 10);
};

const getDefaultTime = (): string => {
  const date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  return date.toISOString().slice(11, 16);
};

const getData = async ({ params, searchParams = {} }: PageProps): Promise<Data> => {
  const query: TimetableRequestQuery = {
    name: params.name,
    id: (searchParams.id as string) || '',
    date: (searchParams.date as string) || getDefaultDate(),
    time: (searchParams.time as string) || getDefaultTime(),
    filter: Array.isArray(searchParams.filter)
      ? searchParams.filter
      : searchParams.filter
      ? [searchParams.filter]
      : ['express', 'train', 's-bahn'],
    type: (searchParams.type as string) || 'both',
    ignoreNullablePlatform: searchParams.ignoreNullablePlatform === 'true' ? 'true' : 'false',
  };

  const data = await fetchTimetable(query);

  return {
    data,
    query,
  };
};

export type TimetableRequestQuery = {
  name: string;
  id: string;
  date: string;
  time: string;
  type: string;
  filter: string | string[];
  ignoreNullablePlatform: 'true' | 'false';
};

export default async function Page({ params, searchParams }: PageProps) {
  const { data, query } = await getData({ params, searchParams });

  return (
    <div>
      <TimetableFilter
        className="sticky top-0 mb-4"
        name={query.name}
        date={query.date || getDefaultDate()}
        time={query.time || getDefaultTime()}
        filter={query.filter || ['express', 'train', 's-bahn']}
        type={query.type || 'both'}
        ignoreNullablePlatform={query.ignoreNullablePlatform}
      />

      {!data ? null : data.data.ids.length > 0 ? (
        <StationIdList ids={data.data.ids} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="px-4 py-1 text-sm font-bold">{data.data.name}</p>
          <div className="flex flex-col">
            {data.data.journeys.map((journey) => (
              <JourneyCard
                className="border-b border-dashed border-gray-300"
                journey={journey}
                key={journey.detailHref}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { data } = await getData({ params, searchParams });

  return {
    title: `Timetable at ${data?.data.name ?? ''}`,
  };
};
