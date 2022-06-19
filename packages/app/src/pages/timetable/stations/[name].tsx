import debounce from 'lodash.debounce';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { JourneyCard } from '../../../components/timetable/JourneyCard';
import { StationIdList } from '../../../components/timetable/StationIdList';
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

type RequestQuery = {
  name: string;
  id: string;
  type: string;
  date: string;
  time: string;
};

const Page: NextPage<Props> = ({ name }) => {
  const router = useRouter();

  // request ready
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TimetableResponse | TimetableWithArrivalDepartureResponse | null>(null);
  const fetchTimetable = useMemo(
    () =>
      debounce(async (query: RequestQuery) => {
        setIsFetching(true);

        const url = new URL(
          query.type === 'both' ? `${location.origin}/api/timetable/depArr` : `${location.origin}/api/timetable`
        );
        url.searchParams.set('station', query.name);
        url.searchParams.set('id', query.id);
        url.searchParams.set('type', query.type);
        url.searchParams.set('date', query.date);
        url.searchParams.set('time', query.time);

        const res = await fetch(url);
        const json = (await res.json()) as TimetableResponse | TimetableWithArrivalDepartureResponse;

        setData(json);
        setIsFetching(false);
      }, 1000),
    []
  );

  // initialize query
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState<RequestQuery>({
    name: '',
    id: '',
    type: '',
    date: '',
    time: '',
  });
  useEffect(() => {
    if (!router.isReady || isReady) {
      return;
    }
    setQuery(() => ({
      name: router.query.name as string,
      id: (router.query.id as string) || '',
      type: (router.query.type as string) || 'dep',
      date: (router.query.date as string) || '',
      time: (router.query.time as string) || '',
    }));
    setIsReady(true);
  }, [router.isReady, router.query, isReady]);

  // fetch
  const updateQuery = useCallback(
    (newQuery: Partial<RequestQuery>) => {
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
    router.replace({
      pathname: router.pathname,
      query,
    });
  }, [router, query]);
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const query: RequestQuery = {
      name: router.query.name as string,
      id: (router.query.id as string) || '',
      type: (router.query.type as string) || 'dep',
      date: (router.query.date as string) || getDefaultDate(),
      time: (router.query.time as string) || getDefaultTime(),
    };
    fetchTimetable(query);
  }, [router.isReady, router.query, fetchTimetable]);

  return (
    <div>
      <Head>
        <title>Timetable at {data?.data.name ?? ''}</title>
      </Head>

      <div className="sticky top-0 mb-4 flex flex-col border-b border-gray-300 bg-white text-sm">
        <p className="border-b border-dashed border-gray-300">
          <input
            className="w-full p-2"
            type="text"
            name="station"
            value={query.name}
            onChange={(e) => {
              updateQuery({ name: e.target.value, id: '' });
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') {
                return;
              }
              query.name !== name && updateQuery({ name: query.name, id: '' });
            }}
            onBlur={() => {
              query.name !== name && updateQuery({ name: query.name, id: '' });
            }}
          />
        </p>
        <p className="flex border-b border-dashed border-gray-300">
          <input
            className="w-1/2 p-2"
            type="date"
            name="date"
            value={query.date || getDefaultDate()}
            onChange={(e) => {
              updateQuery({ date: e.target.value });
            }}
          />
          <input
            className="w-1/2 p-2"
            type="time"
            name="time"
            value={query.time || getDefaultTime()}
            onChange={(e) => {
              updateQuery({ time: e.target.value });
            }}
          />
        </p>
        <p className="flex">
          <label className="w-1/3 p-2">
            <input
              className="mr-2"
              type="radio"
              name="type"
              value="dep"
              checked={(query.type || 'dep') === 'dep'}
              onChange={(e) => {
                updateQuery({ type: e.target.value });
              }}
            />
            Departure
          </label>
          <label className="w-1/3 p-2">
            <input
              className="mr-2"
              type="radio"
              name="type"
              value="arr"
              checked={(query.type || 'dep') === 'arr'}
              onChange={(e) => {
                updateQuery({ type: e.target.value });
              }}
            />
            Arrival
          </label>
          <label className="w-1/3 p-2">
            <input
              className="mr-2"
              type="radio"
              name="type"
              value="both"
              checked={(query.type || 'dep') === 'both'}
              onChange={(e) => {
                updateQuery({ type: e.target.value });
              }}
            />
            Both (Beta)
          </label>
        </p>
      </div>

      {isFetching && <p>Fetching</p>}

      {!data ? null : data.data.ids.length > 0 ? (
        <StationIdList
          ids={data.data.ids}
          onClick={(id) => {
            updateQuery({ id });
          }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">{data.data.name}</p>
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
