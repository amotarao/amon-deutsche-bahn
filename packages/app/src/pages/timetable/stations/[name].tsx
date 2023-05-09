import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { JourneyCard } from '../../../components/timetable/JourneyCard';
import { StationIdList } from '../../../components/timetable/StationIdList';
import { TimetableFilter } from '../../../components/timetable/TimetableFilter';
import { fetchTimetable as fetchTimetableModule } from '../../../modules/fetch-api/timetable';
import { TimetableResponse, TimetableWithArrivalDepartureResponse } from '../../../utils/api/timetable/types';

type Params = {
  name: string;
};

type Props = {
  name: string;
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

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, query, req }) => {
  const reqQuery: TimetableRequestQuery = {
    name: query.name as string,
    id: (query.id as string) || '',
    date: (query.date as string) || getDefaultDate(),
    time: (query.time as string) || getDefaultTime(),
    filter: Array.isArray(query.filter) ? query.filter : query.filter ? [query.filter] : ['express', 'train', 's-bahn'],
    type: (query.type as string) || 'both',
    ignoreNullablePlatform: query.ignoreNullablePlatform === 'true' ? 'true' : 'false',
  };

  const data = await fetchTimetableModule(
    reqQuery,
    new URL(`${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`).origin
  );

  return {
    props: {
      name: params?.name ?? '',
      data,
      query: reqQuery,
    },
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

const Page: NextPage<Props> = ({ data, query }) => {
  return (
    <div>
      <Head>
        <title>Timetable at {data?.data.name ?? ''}</title>
      </Head>

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
};

export default Page;
