import debounce from 'lodash.debounce';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { JourneyCard } from '../../../components/timetable/JourneyCard';
import { StationIdList } from '../../../components/timetable/StationIdList';
import { TimetableFilter } from '../../../components/timetable/TimetableFilter';
import { fetchTimetable as fetchTimetableModule } from '../../../modules/fetch-api/timetable';
import { TimetableResponse, TimetableWithArrivalDepartureResponse } from '../../../utils/api/timetable/types';

type Props = {
  name: string;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  return {
    props: {
      name: (context.params?.name as string) ?? '',
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

const Page: NextPage<Props> = () => {
  const router = useRouter();

  // request ready
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TimetableResponse | TimetableWithArrivalDepartureResponse | null>(null);
  const fetchTimetable = useMemo(
    () =>
      debounce(async (query: TimetableRequestQuery) => {
        setIsFetching(true);
        const json = await fetchTimetableModule(query);
        setData(json);
        setIsFetching(false);
      }, 1000),
    []
  );

  // initialize query
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState<TimetableRequestQuery>({
    name: '',
    id: '',
    date: '',
    time: '',
    filter: '',
    type: '',
    ignoreNullablePlatform: 'false',
  });
  useEffect(() => {
    if (!router.isReady || isReady) {
      return;
    }
    setQuery(() => ({
      name: router.query.name as string,
      id: (router.query.id as string) || '',
      date: (router.query.date as string) || '',
      time: (router.query.time as string) || '',
      filter: Array.isArray(router.query.filter)
        ? router.query.filter
        : router.query.filter
        ? [router.query.filter]
        : ['express', 'train', 's-bahn'],
      type: (router.query.type as string) || 'both',
      ignoreNullablePlatform: router.query.ignoreNullablePlatform === 'true' ? 'true' : 'false',
    }));
    setIsReady(true);
  }, [router.isReady, router.query, isReady]);

  // fetch
  const updateQuery = useCallback(
    (newQuery: Partial<TimetableRequestQuery>) => {
      setQuery((query) => ({
        ...query,
        ...newQuery,
      }));
    },
    [setQuery]
  );
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (query.name === '') {
      return;
    }
    if (JSON.stringify(router.query) === JSON.stringify(query)) {
      return;
    }
    if (
      JSON.stringify([
        router.query.name,
        router.query.id,
        router.query.date,
        router.query.time,
        router.query.type,
        router.query.ignoreNullablePlatform,
      ]) === JSON.stringify([query.name, query.id, query.date, query.time, query.type, query.ignoreNullablePlatform]) &&
      (Array.isArray(router.query.filter) ? router.query.filter.join(',') : router.query.filter) ===
        (Array.isArray(query.filter) ? query.filter.join(',') : query.filter)
    ) {
      return;
    }
    router.replace({
      pathname: router.pathname,
      query,
    });
  }, [router, query]);
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const query: TimetableRequestQuery = {
      name: router.query.name as string,
      id: (router.query.id as string) || '',
      date: (router.query.date as string) || getDefaultDate(),
      time: (router.query.time as string) || getDefaultTime(),
      filter: Array.isArray(router.query.filter)
        ? router.query.filter
        : router.query.filter
        ? [router.query.filter]
        : ['express', 'train', 's-bahn'],
      type: (router.query.type as string) || 'both',
      ignoreNullablePlatform: router.query.ignoreNullablePlatform === 'true' ? 'true' : 'false',
    };
    fetchTimetable(query);
  }, [router.isReady, router.query, fetchTimetable]);

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
        onChange={(arg) => {
          updateQuery(arg);
        }}
      />

      {isFetching && <p className="px-4 py-2 text-sm">Fetching</p>}

      {!data ? null : data.data.ids.length > 0 ? (
        <StationIdList
          ids={data.data.ids}
          onClick={(id) => {
            updateQuery({ id });
          }}
        />
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

const getDefaultDate = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 2);
  return date.toISOString().slice(0, 10);
};

const getDefaultTime = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 2);
  return date.toISOString().slice(11, 16);
};
